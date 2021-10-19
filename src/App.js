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
import {fill, scale, thumbnail} from '@cloudinary/url-gen/actions/resize'
import {byRadius} from '@cloudinary/url-gen/actions/roundCorners'
import Typography from "@mui/material/Typography";
import {Divider} from "@mui/material";
import Stack from '@mui/material/Stack'

function App() {
  const presets = {
    '1': {
      width: 400,
      height: 400,
      radius: 0,
      gravity: 'center',
      zoom: 1,
      effect: 'none',
      blurFace: 'none',
      vignette: false,
      cartoonify: false,
      text: 'none',
      watermark: 'none',
    },
    '2': {
      width: 400,
      height: 400,
      radius: 'max',
      gravity: 'face',
      zoom: 1,
      effect: 'grayscale',
      blurFace: 'none',
      vignette: false,
      cartoonify: false,
      text: 'none',
      watermark: 'none',
    },
    '3': {
      width: 400,
      height: 400,
      radius: 'max',
      gravity: 'face',
      zoom: 1,
      effect: 'none',
      blurFace: 'none',
      vignette: false,
      cartoonify: false,
      text: 'none',
      watermark: 'none',
    },
    '4': {
      width: 400,
      height: 400,
      radius: 0,
      gravity: 'center',
      zoom: 1,
      effect: 'none',
      blurFace: 'e_blur_faces',
      vignette: false,
      cartoonify: false,
      text: 'none',
      watermark: 'none',
    },
    '5': {
      width: 400,
      height: 400,
      radius: 0,
      gravity: 'center',
      zoom: 1,
      effect: 'none',
      blurFace: 'none',
      vignette: true,
      cartoonify: false,
      text: 'none',
      watermark: 'none',
    },
    '6': {
      width: 400,
      height: 400,
      radius: 0,
      gravity: 'center',
      zoom: 1,
      effect: 'none',
      blurFace: 'none',
      vignette: false,
      cartoonify: true,
      text: 'none',
      watermark: 'none',
    },
    '7': {
      width: 400,
      height: 400,
      radius: 0,
      gravity: 'center',
      zoom: 1,
      effect: 'none',
      blurFace: 'none',
      vignette: false,
      cartoonify: false,
      text: 'l_text:Arial_45_bold:Hello World,g_south,co_orange,x_20,y_20',
      watermark: 'none',
    },
    '8': {
      width: 400,
      height: 400,
      radius: 0,
      gravity: 'center',
      zoom: 1,
      effect: 'none',
      blurFace: 'none',
      vignette: false,
      cartoonify: false,
      text: 'none',
      watermark: 'l_guru_dpzplt,o_30,g_south,x_20,y_20',
    }
  }
  const [imageSettings, setImageSettings] = useState({
    width: 400,
    height: 400,
    radius: 0,
    gravity: 'center',
    zoom: 1,
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

  const pattern = /https:\/\/res\.cloudinary\.com\/(.*)\/.*\/.*\/.*\/(.*)/
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
    myImage
      .resize(thumbnail().width(imageSettings.width).height(imageSettings.height).gravity(imageSettings.gravity).zoom(imageSettings.zoom))
      .roundCorners(byRadius(imageSettings.radius))

    if (imageSettings.effect === 'sepia') {
      myImage.adjust(Actions.Effect.sepia())
    } else if (imageSettings.effect === 'grayscale') {
      myImage.adjust(Actions.Effect.grayscale())
    }

    if (imageSettings.blurFace !== 'none') {
      myImage.addTransformation('e_blur_faces')
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



  const processedImage = (match) ? <AdvancedImage cldImg={myImage}/> :
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
                <Settings action={handleSettingsChange}/>
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
                                        label="Vannmerke"/>
                    </RadioGroup>
                  </FormControl>
                </Box>
              </TabPanel>
            </TabContext>
          </Box>
        </Grid>

        <Grid item>
          <Box sx={{mt: 4}}>
            <Typography component="h2" variant={'h4'} gutterBottom>
              Image
            </Typography>
            <Divider sx={{mb: 2}}>Original URL</Divider>
          </Box>
          <Box
            component="form"
            sx={{
              '& > :not(style)': {m: 1, width: '100ch'},
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-basic"
              label={'URL in'}
              variant="outlined"
              value={inputImage}
              onChange={(event) => onImageUrlChange(event.target.value)}
            />
          </Box>
          <Grid
            container
            sx={{width: 915, height: 800, direction: 'row', alignItems: 'center', justifyContent: 'center'}}
          >
            <Grid item>
              {processedImage}
            </Grid>
          </Grid>
          <Box
            component="form"
            sx={{
              '& > :not(style)': {m: 1, width: '100ch'},
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-basic"
              label={'URL out'}
              variant="outlined"
              value={(myImage) ? myImage.toURL() : ''}
            />
          </Box>
            <Stack spacing={2} direction="row">
              <Box
                component="form"
                sx={{
                  '& > :not(style)': {m: 1, width: '25ch'},
                }}
                noValidate
                autoComplete="off"
              >
            <TextField
              id="outlined-basic"
              label={'Cloudinary Account Name'}
              variant="outlined"
              value={(accountName) ? accountName : ''}
            />
              </Box>
              <Box
                component="form"
                sx={{
                  '& > :not(style)': {m: 1, width: '43ch'},
                }}
                noValidate
                autoComplete="off"
              >
            <TextField
              id="outlined-basic"
              label={'Transformations'}
              variant="outlined"
              value={(transformations) ? transformations : ''}
            />
              </Box>
              <Box
                component="form"
                sx={{
                  '& > :not(style)': {m: 1, width: '25ch'},
                }}
                noValidate
                autoComplete="off"
              >
            <TextField
              id="outlined-basic"
              label={'URL out'}
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
