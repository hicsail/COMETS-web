import {  Box,
          Grid,
          Typography,
          ThemeProvider,
          createTheme,
          Select,
          MenuItem,
          SelectChangeEvent,
          Radio,
          RadioGroup,
          FormControlLabel,
          FormControl,
          FormLabel,
          Button,
          TextField
        } from "@mui/material";
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';

const bodyTheme = createTheme({
  typography: {
    h1: {
      fontSize: 45,
      fontWeight: 700
    },
    h2: {
      fontSize: 25,
      fontWeight: 600
    },
    h3: {
      fontSize: 18
    }
  }
});

export function ResultsPage() {
  const { id } = useParams()
  const [imageUrl, setImageUrl] = useState('');
  const [graphUrl, setGraphUrl] = useState('');
  const [imageLoading, setImageLoading] = useState(true);
  const [graphLoading, setGraphLoading] = useState(true);

  // Contains value to make the selection for image results (biomass/metabolite/flux) 
  const [imageSelection, setImageSelection] = useState('biomass'); 

  // Contains value for the model chose with radio button (for biomass and flux images)
  const [modelId, setModelId] = useState('')
  
  // Contains value to make the selection for graph results (total_biomass/metabolite_time_series) 
  const [graphSelection, setGraphSelection] = useState('total_biomass')
  
  // Contains ID value of a picked flux
  const [fluxId, setFluxId] = useState('')

  // Contains all of the possible model-fluxes pairings for a given simulation
  const [allFluxes, setAllFluxes] = useState<{
    model_id: string,
    fluxes: string[]
  }[]>([]) 

  // Contains a string list of all fluxes of a single models based on value of modelSelection
  const [fluxOptions, setFluxOptions] = useState<string[]>([])

  // Contains NAME and ID value for a picked metabolite
  const [metaboliteName, setMetaboliteName] = useState<string | undefined >('')
  const [metaboliteId, setMetaboliteId] = useState<string | undefined >('')
  
  // Contains all the available models in the simulation. Is populated inside useEffect()
  const [modelOption, setModelOption] = useState<{
    name: string,
    model_id: string
  }[]>([]);

  // Contains all available metabolites in the simulation. Is populated inside useEffect()
  const [metaboliteOption, setMetaboliteOption] = useState<{
    name: string,
    id: string
  }[]>([]);
  
  
  // Fixed choice of viewing the result graphs
  const graphOption = [
    'metabolite_time_series',
    'total_biomass'
  ]
  
  // Fixed choice of viewing the result images
  const selectOption = [
    "biomass",
    "metabolite",
    "flux"
  ]
  
  // Handdles changes in the result images that the user wants to see
  const handleImageSelectionChange = (event: SelectChangeEvent) => {
    setImageSelection(event.target.value as string);
  };

  // Handdles changes in the result graphs that the user wants to see
  const handleGraphChange = (event: SelectChangeEvent) => {
    setGraphSelection(event.target.value as string)
  }

  // Handle changes of which model the user wants to see for biomass result images
  const handleModelRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setModelId(event.target.value as string)
  }

  // Handle changes of which model the user wants to see for flux result images
  // Also sets the available flux options for a given model
  const handleFluxRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    const model = event.target.value as string;
    allFluxes.forEach((flux) => {
      const flux_arr: string[] = flux.fluxes
      if(String(flux.model_id) === model){
        setFluxOptions(flux_arr)
      }
    })
    setModelId(event.target.value as string)
  }

  // Handles actions when the "APPLY" button is clicked for the image results
  // Action includes building the appopriate request body and fecthing the results from the Flask server
  const handleImageApplyButton = () => {
    const builtUrl = `${import.meta.env.VITE_COMETS_FLASK}/result/${id}/${imageSelection}` 
    let builtBody;
    
    if(imageSelection === 'biomass'){
      builtBody = {
        model_name: '', // Doesn't help with anything 
        model_id: modelId
      }
    }else if(imageSelection === 'metabolite'){
      builtBody = {
        metabolite_name: metaboliteName,
        metabolite_id: metaboliteId
      }
      
    }else if(imageSelection === 'flux'){
      builtBody = {
        flux_name: fluxId,
        flux_id: fluxId,
        model_name: '', // Doesn't help with anything
        model_id: modelId
      }
    }else{
      console.log('cant find the right selection')
      // Throw error
    }
    console.log(builtBody)
    setImageLoading(true);
    fetch(builtUrl, {
      method: "POST",
      cache: "default",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      body: JSON.stringify(builtBody)
    })
    .then(response => {
      if(!response.ok){
        throw new Error('Network reponse failed');
      }
      return response.blob();
    })
    .then(blob => {
      const imageSrc = URL.createObjectURL(blob);
      setImageUrl(imageSrc);
      setImageLoading(false);
    })
    .catch(() => {
      setImageLoading(false);
    } )
  }


  // Handles actions when the "APPLY" button is clicked for the graph results
  // Action includes building the appopriate request body and fecthing the results from the Flask server
  const handleGraphApplyButton= () => {
    const builtUrl = `${import.meta.env.VITE_COMETS_FLASK}/result/graph/${id}/${graphSelection}` 
    setGraphLoading(true);
    fetch(builtUrl, {
      method: "GET",
      cache: "default",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
    })
    .then(response => {
      if(!response.ok){
        throw new Error('Network reponse failed');
      }
      return response.blob();
    })
    .then(blob => {
      const imageSrc = URL.createObjectURL(blob);
      setGraphUrl(imageSrc);
      setGraphLoading(false);
    })
    .catch((err) => {
      console.log(err)
      // Throw error
    } )
  }

  // Handle changes when a different flux is chosen from the dropdown
  const handleFluxChange = (event: any) => {
    setFluxId(event.target.value as string)
  };

  // Handle changes when a different metabolite is chosen from the dropdown
  const handleMetaboliteChange = (event: any) => {
    const met = metaboliteOption.find(metabolite => metabolite.id ===  (event.target.value as string))
    setMetaboliteId(met?.id)
    setMetaboliteName(met?.name)
    
  };
  
  useEffect(() => {
    const url = `${import.meta.env.VITE_COMETS_BACKEND}/job/${id}`
    let models;
    let metabolites;
    let req_body;
    let fluxes;
    fetch(url,
      {
        method: "GET", 
        cache: "default", 
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow"
      }
    )
    .then((response) => {
      if(!response.ok){
        throw new Error('Network reponse failed');
      }
      return response.json();
    })
    .then((data) => {
      models = data.model_info;
      metabolites = data.metabolites;
      fluxes = data.fluxes;

      // Setting all values to the options from the simulation
      setModelOption(models)
      setMetaboliteOption(metabolites)
      setAllFluxes(fluxes)

      req_body = {
        model_name: models ? models[0]['name'] : '' ,
        model_id: models ? models[0]['model_id'] : ''
      }
      const urls = `${import.meta.env.VITE_COMETS_FLASK}/result/${id}/biomass`;
      
      // Fetching default result iamge which is the biomass image
      fetch(urls, 
        {
          method: "POST", 
          cache: "default",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
          body: JSON.stringify(req_body), // body data type must match "Content-Type" header
        })
        .then(response => {
          if(!response.ok){
            throw new Error('Network reponse failed');
          }
          return response.blob();
        })
        .then(blob => {
          const imageSrc = URL.createObjectURL(blob);
          setImageUrl(imageSrc);
          setImageLoading(false);
        })
        .catch((err) => {
          console.log(err)
        })
      return;
    })
    .catch((err) => {
      console.log(err)
    })  

    
      
  },[])

  // Getting the default graph  which is the total_biomass graph 
  useEffect(() => {
    const graphUrl = `${import.meta.env.VITE_COMETS_FLASK}/result/graph/${id}/total_biomass` 
    //Fetch default graph
    fetch(graphUrl, 
      {
        method: "GET", 
        cache: "default",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow"
      })
      .then(response => {
        if(!response.ok){
          throw new Error('Network reponse failed');
        }
        return response.blob();
      })
      .then(blob => {
        const imageSrc = URL.createObjectURL(blob);
        setGraphUrl(imageSrc);
        setGraphLoading(false);
      })
      .catch((err) => {
        console.log(err)
      })      
  },[])

  useEffect(() => {
    
  }, [])
  

  return (
    <ThemeProvider theme={bodyTheme}>
      <Box
        component="main"
        sx={{
          position: "relative",
          height: "200vh",
        }}
      >
        <Grid container spacing={1} flexDirection={'column'}>
          <Grid item xs={6}>
            <Grid
              container
              spacing={2}
              direction="column"
              alignItems="left"
              style={{
                paddingLeft: '2vw',

              }}
            >
              <Typography
                variant="h1"
                sx={{
                  color: "black",
                  textAlign: "left",
                  paddingBottom: "10%",
                  paddingTop: "5%",
                }}
              >
                SIMULATION RUN RESULTS
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{width:'90vh', height: '40vh', backgroundColor:'#F1EDF6', marginLeft:5, padding: 5, paddingBottom: 0, paddingTop:2}}>
              <Typography
                textAlign={'left'}
                paddingLeft={2.5}
                variant="h2"
                color={'black'}
              >
                Choose an image to view
              </Typography>
              <Box sx={{display:'flex', justifyContent:'space-between', padding:2}}>
                <Select 
                  labelId="select-id"
                  id="simple-select-id"
                  value={imageSelection}
                  onChange={handleImageSelectionChange}
                  sx={{width:'70%', textAlign:'left'}}
                >
                  {selectOption.map((option, index) => (
                      <MenuItem value={option} key={index}>{option}</MenuItem>
                    )
                  )}
                </Select>
                <Button 
                    onClick={handleImageApplyButton}
                    variant='outlined'
                    sx={{minWidth:'15%', maxWidth:'20%'}}
                >
                    APPLY
                </Button>
              </Box>
              { 
                imageSelection === 'biomass' &&
                <Box sx={{textAlign:'left', padding:2.5}}>
                  <FormControl>
                    <FormLabel>Which Model Do You Want To See?</FormLabel>
                    <RadioGroup name="model-radio-group">
                      {
                        modelOption.map((model, index) => (
                          <FormControlLabel key={index} value={model.model_id} label={`${model.name} (${model.model_id})`} control={<Radio onChange={handleModelRadioChange} defaultValue={''}/>} style={{color:'black'}}/>
                        ))
                      }
                    </RadioGroup>
                  </FormControl>
                </Box>
              }
              { 
                imageSelection === 'metabolite' &&
                <Box sx={{textAlign:'left', padding:2.5}}>
                  <FormControl>
                    <FormLabel>Which Metabolite Do You Want To See?</FormLabel>
                    <TextField
                      select
                      onChange={handleMetaboliteChange}
                      value={metaboliteId}
                      sx={{width:'100%', textAlign:'left'}}
                    >
                        {metaboliteOption.map((option, index) => (
                          <MenuItem value={option.id} key={index}>{option.name}</MenuItem>
                          )
                        )}
                    </TextField>
                  </FormControl>
                </Box>
              }
              { 
                imageSelection === 'flux' &&
                <Box sx={{textAlign:'left', padding:2.5, display:'flex', justifyContent:'flex-start', gap: '5%'}}>
                  <FormControl>
                    <FormLabel>Which Model Do You Want To See?</FormLabel>
                    <RadioGroup name="model-radio-group">
                      {
                        modelOption.map((model, index) => (
                          <FormControlLabel key={index} value={model.model_id} label={`${model.name} (${model.model_id})`} control={<Radio onChange={handleFluxRadio} defaultValue={''}/>} style={{color:'black'}}/>
                        ))
                      }
                    </RadioGroup>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Which Flux Do You Want To See?</FormLabel>
                    <TextField
                      select
                      onChange={handleFluxChange}
                      value={fluxId}
                      sx={{width:'100%', textAlign:'left'}}
                    >
                        {fluxOptions.map((option, index) => (
                          // Value and display name not same as Metabolite because there is too much flux and no dictionary was given
                          <MenuItem value={option} key={index}>{option}</MenuItem> 
                          )
                        )}
                    </TextField>
                  </FormControl>
                </Box>
              }
              {
                imageLoading ?
                <CircularProgress /> :
                <img
                  src={imageUrl}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    display: 'block' // Removes bottom space/gap
                  }}
                />
             }
            </Box>

            <Box sx={{width:'90vh', height: '40vh', backgroundColor:'#F1EDF6', marginLeft:5, padding: 5, paddingBottom: 10, paddingTop:30}}>
              <Typography
                textAlign={'left'}
                paddingLeft={2.5}
                variant="h2"
                color={'black'}
              >
                Choose an graph to view
              </Typography>
              <Box sx={{display:'flex', justifyContent:'space-between', padding:2}}>
              <Select 
                labelId="select-id"
                id="simple-select-id"
                value={graphSelection}
                label='Pick an image to generate'
                onChange={handleGraphChange}
                sx={{width:'70%', textAlign:'left'}}
              >
                {graphOption.map((option, index) => (
                    <MenuItem value={option} key={index}>{option}</MenuItem>
                  )
                )}
              </Select>
              <Button 
                    onClick={handleGraphApplyButton}
                    variant='outlined'
                    sx={{minWidth:'15%', maxWidth:'20%'}}
                >
                    APPLY
              </Button>
              </Box>
              {
                graphLoading ?
                <CircularProgress /> :
                <img
                  src={graphUrl}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    display: 'block' // Removes bottom space/gap
                  }}
                />
             }
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
