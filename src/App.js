import React, {useState} from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import Settings from './components/Settings'
import {Cloudinary} from '@cloudinary/url-gen'
import {AdvancedImage} from '@cloudinary/react'
import {fill, scale, thumbnail} from '@cloudinary/url-gen/actions/resize'
import {byRadius} from '@cloudinary/url-gen/actions/roundCorners'
import Typography from "@mui/material/Typography";
import {Divider} from "@mui/material";


function App() {

  const [imageSettings, setImageSettings] = useState({
    width: 200,
    height: 200,
    radius: 0,
    gravity: 'center',
    zoom: 1
  })
  const [inputImage, setInputImage] = useState('https://res.cloudinary.com/dipmnmohl/image/upload/v1619610667/woman_zaij6u.jpg')

  const pattern = /https:\/\/res\.cloudinary\.com\/(.*)\/.*\/.*\/.*\/(.*)/
  let match = pattern.exec(inputImage)

  let accountName = null
  let imageId = null
  let cld = null
  let myImage = null

  if (match) {
    accountName = match[1]
    imageId = match[2]

    cld = new Cloudinary({
      cloud: {
        cloudName: accountName
      }
    })
    myImage = cld.image(imageId)
    myImage.resize(thumbnail().width(imageSettings.width).height(imageSettings.height).gravity(imageSettings.gravity).zoom(imageSettings.zoom))
      .roundCorners(byRadius(imageSettings.radius))
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
    <img src={'/placeholder.png'} style={{ width: 400, height: 300 }}/>

  return (
    <Container maxWidth={'xl'}>
      <Grid container spacing={2} direction={'row'}>
        <Grid item>
          <Settings action={handleSettingsChange}/>
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
        </Grid>
      </Grid>
    </Container>

  )
}

export default App
