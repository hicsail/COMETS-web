# COMETS-Web

## Introduction

This project was created in collaboration between the Software and Application Innovation Lab at Boston University and the Boston University faculty members, Ilija Dukovski and Daniel Segre, behind the cell biology simulation software COMETS. The goal of this collaboration was to enable running the COMETS software through a web interface.

This repository contains the code necessary for the website, backend logic, and COMETS runner. The website provides an interface for a subset of the COMETS parameters. Those parameters are then used to run a COMETS simulation within a Kubernetes job. The website then has the ability to display the resulting visualizations of the simulation.

## Software Organization

The code is divided into a frontend, backend, and runner which handles the major functionality of COMETS-web. Each have a README which covers the specifics of that package.

* [packages/backend](./packages/backend/README.md): Backend which keeps track of COMETS simulations and provides a means for the frontend to submit jobs and retrieve job results
* [packages/frontend](./packages/frontend/README.md): Frontend view which includes a form for capturing a subset of the COMETS simulation parameters as well as a means to visualize results.
* [packages/runner](./packages/runner/README.md): Wrapper around COMETS which allows for running the software with a container. Includes a CLI interface, supporting libraries, and Dockerfile for building a containerized COMETS instance.

## Features

* Submitting COMETS job for simulation
* Execution of COMETS simulation within Kubernetes Job
* Visualization of simulation results
* Email to user on job completion
* Email to maintainers on job failure

## Running Locally

Each component can be run locally and tested individually either with another locally run component or with a component running remotely. Refer to the README of each component on how to run each component. Follow the instructions below for running the supporting software (MongoDB and Redis).



## Appendix

### Glossary

| Term       | Definition                                                   |
| ---------- | ------------------------------------------------------------ |
| COMETS     | Computation Of Microbial Ecosystems in Time and Space        |
| COMETS-web | Software in this repository which handles running COMETS in a web environment |
|            |                                                              |
|            |                                                              |



