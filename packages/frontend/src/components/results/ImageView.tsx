import { Box } from '@mui/material';

export interface ImageViewProps {
  src: string;
}

export const ImageView: React.FC<ImageViewProps> = ({ src }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      <Box
        component="img"
        src={src}
        sx={{
          maxWidth: '100%'
        }}
      />
    </Box>
  );
};
