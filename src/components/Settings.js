import React, { useState } from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Slider from '@mui/material/Slider'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import {FormControl, InputLabel, Select, MenuItem} from '@mui/material'


const Settings = (props) => {
  const { action } = props
  const gravityTypes = ['center', 'auto', 'north', 'west', 'south', 'east', 'face', 'faces']
  const effects = ['none', 'sepia', 'grayscale']
  const radiusTypes = [0, 25, 50, 100, 'max']
  const zoomMarks = [
    {
      value: 0.2,
      label: '0.2',
    },
    {
      value: 0.5,
      label: '0.5',
    },
    {
      value: 0.8,
      label: '0.8',
    },
    {
      value: 1,
      label: '1',
    },
    {
      value: 1.2,
      label: '1.2',
    },
    {
      value: 1.5,
      label: '1.5',
    },
    {
      value: 2,
      label: '2',
    },
  ];
  const [dimensions, setDimensions] = useState({
    width: 200,
    height: 200,
  })
  const [gravity, setGravity] = useState(gravityTypes[0])
  const [zoom, setZoom] = useState(1)
  const [radius, setRadius] = useState(radiusTypes[0])
  const [effect, setEffect] = useState('none')

  const onWidthChange = (val) => {
    let newVal = parseInt(val)
    setDimensions((prevState) => {
      return {
        ...prevState,
        width: newVal
      }
    })
  }

  const onHeightChange = (val) => {
    let newVal = parseInt(val)
    setDimensions((prevState) => {
      return {
        ...prevState,
        height: newVal
      }
    })
  }

  const onGravityChange = (val) => {
    setGravity(val)
  }

  const onRadiusChange = (val) => {
    let newVal = (isNaN(val)) ? val : parseInt(val)
    setRadius(newVal)
  }

  const onEffectChange = (val) => {
    setEffect(val)
  }

  const onConfirm = () => {
    let settings = {
      ...dimensions,
      zoom: zoom,
      gravity: gravity,
      radius: radius,
      effect: effect,
    }
    action(settings)
  }

  const valuetext = (val) => {
    return `${val}`;
  }

  const valueLabelFormat = (val) => {
    return zoomMarks.findIndex((x) => x.value === val) + 1;
  }

  return(
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography component="h2" variant={'h4'} gutterBottom>
          Settings
        </Typography>
        <Divider sx={{mb: 2}}>Dimensions</Divider>
        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <div>

          </div>
          <TextField
            id="outlined-number"
            label="Width"
            defaultValue="Default Value"
            value={dimensions.width}
            onChange={(event) => onWidthChange(event.target.value)}
          />
          <TextField
            id="outlined-number"
            label="Height"
            defaultValue="Default Value"
            value={dimensions.height}
            onChange={(event) => onHeightChange(event.target.value)}
          />
        </Box>
        <Divider sx={{ mt: 4, mb:2 }}>Gravity</Divider>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Gravity</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={gravity}
            label="Gravity"
            onChange={(event) => onGravityChange(event.target.value)}
          >
            {
              gravityTypes.map((x) => {
                return <MenuItem key={x} value={x}>{x[0].toUpperCase() + x.slice(1).toLowerCase()}</MenuItem>
              })
            }
          </Select>
        </FormControl>
        <Divider sx={{ mt: 4, mb: 4}}>Zoom</Divider>
        <Box>
          <Slider
            aria-label="Restricted values"
            defaultValue={1}
            min={0.2}
            max={2}
            valueLabelFormat={valueLabelFormat}
            getAriaValueText={valuetext}
            step={null}
            valueLabelDisplay="auto"
            marks={zoomMarks}
            value={zoom}
            onChange={(event) => setZoom(event.target.value)}
          />
        </Box>
        <Divider sx={{ mt: 4, mb:2 }}>Radius</Divider>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Radius</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={radius}
            label="Gravity"
            onChange={(event) => onRadiusChange(event.target.value)}
          >
            {radiusTypes.map((x) => <MenuItem key={x} value={x}>{x}</MenuItem>)}
          </Select>
        </FormControl>
        <Divider sx={{ mt: 4, mb:2 }}>Effects</Divider>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Effects</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={effect}
            label="Effects"
            onChange={(event) => onEffectChange(event.target.value)}
          >
            {effects.map((x) => <MenuItem key={x} value={x}>{x[0].toUpperCase() + x.slice(1).toLowerCase()}</MenuItem>)}
          </Select>
        </FormControl>
        <Stack spacing={2} direction="row">
          <Button sx={{ mt: 4}} variant="contained" onClick={onConfirm}>Confirm</Button>
        </Stack>
      </Box>
    </Container>
  )
}

export default Settings