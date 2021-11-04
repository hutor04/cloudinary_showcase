import React, {useState} from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Tab from '@mui/material/Tab'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TextField from '@mui/material/TextField'
import Settings from './components/Settings'
import {Cloudinary, Actions} from '@cloudinary/url-gen'
import {AdvancedImage} from '@cloudinary/react'
import {thumbnail} from '@cloudinary/url-gen/actions/resize'
import {byRadius} from '@cloudinary/url-gen/actions/roundCorners'
import Typography from "@mui/material/Typography";
import {Divider, InputLabel, MenuItem, Select} from "@mui/material";
import Stack from '@mui/material/Stack'
import { presets } from './configs/image-presets'

function App() {
  const aspectRatios = ['none', '1:1', '5:4', '3:1', '3:2', '4:3', '16:9']
  const [imageSettings, setImageSettings] = useState({
    aspectRatio: 'none',
    width: 'None',
    height: 'None',
    radius: 'None',
    gravity: 'none',
    zoom: 'None',
    effect: 'none',
    blurFace: 'none',
    vignette: false,
    cartoonify: false,
    text: 'none',
    watermark: 'none',
  })
  const [inputImage, setInputImage] = useState('https://res.cloudinary.com/dipmnmohl/image/upload/v1619610667/woman_zaij6u.jpg')

  const [valueTab, setValueTab] = React.useState('1')

  const handleTabClick = (event, newValue) => {
    setValueTab(newValue)
  }

  const handlePresetSelection = (event) => {
    let presetId = event.target.value
    setImageSettings((prevState) => {
      return ({
        ...prevState,
        ...presets[presetId],
      })
    })
  }

  const pattern = /https:\/\/res\.cloudinary\.com\/(.*?)\/image\/upload(?:\/.*\/|\/)(.*)/
  let match = pattern.exec(inputImage)
  let accountName = null
  let imageId = null
  let cld = null
  let myImage = null
  let f_name = ''
  let transformations = ''


  if (match) {
    accountName = match[1]
    imageId = match[2]

    cld = new Cloudinary({
      cloud: {
        cloudName: accountName
      }
    })
    myImage = cld.image(imageId)

    let resize_transform = 'c_thumb,'
    if (imageSettings.height !== 'None') {
      resize_transform += `h_${imageSettings.height},`
    }
    if (imageSettings.width !== 'None') {
      resize_transform += `w_${imageSettings.width},`
    }
    if (imageSettings.gravity !== 'none') {
      resize_transform += `g_${imageSettings.gravity},`
    }
    if (imageSettings.zoom !== 'None') {
      resize_transform += `z_${imageSettings.zoom},`
    }
    if (resize_transform !== 'c_thumb,') {
      myImage.addTransformation(resize_transform.slice(0, -1))
    }

    if (imageSettings.radius !== 'None') {
      myImage.roundCorners(byRadius(imageSettings.radius))
    }

    if (imageSettings.aspectRatio !== 'none') {
      myImage.resize(thumbnail().aspectRatio(imageSettings.aspectRatio))
    }

    if (imageSettings.effect === 'sepia') {
      myImage.adjust(Actions.Effect.sepia())
    } else if (imageSettings.effect === 'grayscale') {
      myImage.adjust(Actions.Effect.grayscale())
    }

    if (imageSettings.blurFace !== 'none') {
      myImage.addTransformation(imageSettings.blurFace)
    }
    if (imageSettings.vignette) {
      myImage.adjust(Actions.Effect.vignette())
    }
    if (imageSettings.cartoonify) {
      myImage.adjust(Actions.Effect.cartoonify())
    }
    if (imageSettings.text !== 'none') {
      myImage.addTransformation(imageSettings.text)
    }
    if (imageSettings.watermark !== 'none') {
      myImage.addTransformation(imageSettings.watermark)
    }

    // Outs
    let resultUrl = myImage.toURL()
    const pattern_f_name = /^.*\/(.*)$/
    const pattern_transformations = new RegExp('^.*\/upload\/(.*)\/')
    let match_f_name = pattern_f_name.exec(resultUrl)
    if (match_f_name) {
      f_name = match_f_name[1]
    }
    let match_transformations = pattern_transformations.exec(resultUrl)
    if (match_transformations) {
      transformations = match_transformations[1]
    }
  }

  const onImageUrlChange = (val) => {
    setInputImage(val)
  }

  const handleSettingsChange = (val) => {
    setImageSettings({
      ...val
    })
  }

  const handleAspectRatioChange = (val) => {
    setImageSettings((prevState) => {
      return ({
        ...prevState,
        aspectRatio: val
      })
    })
  }



  const processedImage = (match) ? <AdvancedImage cldImg={myImage} style={{maxWidth: 1400}}/> :
    <img src={'/placeholder.png'} style={{width: 400, height: 300}}/>

  return (
    <Container maxWidth={'false'}>
      <Grid container spacing={2} direction={'row'}>
        <Grid item>
          <Box maxWidth="sm" marginTop={'47px'}>
            <TabContext value={valueTab}>
              <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <TabList onChange={handleTabClick} aria-label="lab API tabs example">
                  <Tab label="Egendefinert konfigurator" value="1"/>
                  <Tab label="Forhåndsdefinerte konfigurasjoner" value="2"/>
                </TabList>
              </Box>
              <TabPanel value="1">
                <Settings
                  data={imageSettings}
                  action={handleSettingsChange}
                />
              </TabPanel>
              <TabPanel value="2">
                <Box minWidth={'529px'}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      aria-label="image-config"
                      defaultValue="1"
                      name="radio-buttons-group"
                    >
                      <FormControlLabel value="1" control={<Radio/>} onClick={handlePresetSelection} label="Default"/>
                      <FormControlLabel value="2" control={<Radio/>} onClick={handlePresetSelection}
                                        label="Rundt bilde + svart/hvit"/>
                      <FormControlLabel value="3" control={<Radio/>} onClick={handlePresetSelection}
                                        label="Rundt bilde"/>
                      <FormControlLabel value="4" control={<Radio/>} onClick={handlePresetSelection}
                                        label="Anonymiser ansikt i bilder"/>
                      <FormControlLabel value="5" control={<Radio/>} onClick={handlePresetSelection}
                                        label="Vignett"/>
                      <FormControlLabel value="6" control={<Radio/>} onClick={handlePresetSelection}
                                        label="Cartoonify"/>
                      <FormControlLabel value="7" control={<Radio/>} onClick={handlePresetSelection}
                                        label="Tekst"/>
                      <FormControlLabel value="8" control={<Radio/>} onClick={handlePresetSelection}
                                        label="To runde hjørner"/>
                    </RadioGroup>
                  </FormControl>
                  <Divider sx={{ mt: 4, mb:2 }}>Aspect Ratio</Divider>
                  <FormControl fullWidth>
                    <InputLabel id="aspect-ratio">Ratio</InputLabel>
                    <Select
                      labelId="aspect-ratio"
                      id="demo-simple-select"
                      value={imageSettings.aspectRatio}
                      label="Gravity"
                      onChange={(event) => handleAspectRatioChange( event.target.value)}
                    >
                      {
                        aspectRatios.map((x) => {
                          return <MenuItem key={x} value={x}>{x[0].toUpperCase() + x.slice(1).toLowerCase()}</MenuItem>
                        })
                      }
                    </Select>
                  </FormControl>
                </Box>
              </TabPanel>
            </TabContext>
          </Box>
        </Grid>

        <Grid item  xs={6} md={8}>
          <Box sx={{mt: 4}}>
            <Typography component="h2" variant={'h4'} gutterBottom>
              Image
            </Typography>
            <Divider sx={{mb: 2}}>Original URL</Divider>
          </Box>
          <Box
            component="form"
            sx={{
              '& > :not(style)': {m: 1, width: '150ch'},
            }}
            noValidate
            autoComplete="off"
          >
            <FormControl fullWidth>
            <TextField
              id="outlined-basic"
              label={'URL inn'}
              variant="outlined"
              value={inputImage}
              onChange={(event) => {
                event.preventDefault()
                onImageUrlChange(event.target.value)
              }}
              onSubmit={(event) => {
                event.preventDefault()
              }}
            />
            </FormControl>
          </Box>
          <Grid
            container
            sx={{minWidth: 1400, minHeight: 800, direction: 'row', alignItems: 'center', justifyContent: 'center'}}
          >
            <Grid item>
              {processedImage}
            </Grid>
          </Grid>
          <Box
            component="form"
            sx={{
              '& > :not(style)': {m: 1, width: '150ch'},
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-basic"
              label={'URL ut'}
              variant="outlined"
              value={(myImage) ? myImage.toURL().substring(0, myImage.toURL().indexOf('?')) : ''}
            />
          </Box>
            <Stack spacing={2} direction="row">
              <Box
                component="form"
                sx={{
                  '& > :not(style)': {m: 1, width: '48ch'},
                }}
                noValidate
                autoComplete="off"
              >
            <TextField
              id="outlined-basic"
              label={'Fast Cloudinary URL'}
              variant="outlined"
              value={(accountName) ? `https://res.cloudinary.com/${accountName}/image/upload` : ''}
            />
              </Box>
              <Box
                component="form"
                sx={{
                  '& > :not(style)': {m: 1, width: '47ch'},
                }}
                noValidate
                autoComplete="off"
              >
            <TextField
              id="outlined-basic"
              label={'Konfigurasjoner'}
              variant="outlined"
              value={(transformations) ? transformations : ''}
            />
              </Box>
              <Box
                component="form"
                sx={{
                  '& > :not(style)': {m: 1, width: '48ch'},
                }}
                noValidate
                autoComplete="off"
              >
            <TextField
              id="outlined-basic"
              label={'Filnavn'}
              variant="outlined"
              value={(imageId) ? imageId : ''}
            />
              </Box>
            </Stack>
        </Grid>
      </Grid>
    </Container>

  )
}

export default App

// TODO
// Tabs, Additional use cases, split output URL to 3 components.
