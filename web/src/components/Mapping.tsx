import { Button, Grid, MenuItem, Select } from "@material-ui/core"
import { Loader } from "google-maps";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react"
import { getCurrentPositon } from "../utils/geolocation";
import { Route } from "../utils/models";

const API_URL = process.env.REACT_APP_API_URL
const googleMapsLoader = new Loader(process.env.REACT_APP_GOOGLE_API_KEY)

export const Mapping = () => {
  const [routes, setRoutes] = useState<Route[]>([])
  const [routeIdSelected, setRouteIdSelected] = useState<string>('')
  const mapRef = useRef<google.maps.Map>()

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch(`${API_URL}/routes`)
        const jsonResponse = await response.json()
        // console.log('routes: ', jsonResponse)
        setRoutes(jsonResponse)
      } catch (error) {
        console.error('ERROR: ', error)
      }
    }

    fetchRoutes()
  }, [])

  useEffect(() => {
    (async () => {
      const [, position] = await Promise.all([
        googleMapsLoader.load(),
        getCurrentPositon({ enableHighAccuracy: true })
      ])
      const divMap = document.getElementById('map') as HTMLElement
      mapRef.current = new google.maps.Map(divMap, {
        zoom: 15,
        center: position
      })
    })()

  }, [])

  const startRoute = useCallback((event: FormEvent) => {
    event.preventDefault()
    const route = routes.find(route => route.id === routeIdSelected)
    new google.maps.Marker({
      position: route?.startPosition,
      map: mapRef.current,
      icon: {
        path:
          "M23.5 7c.276 0 .5.224.5.5v.511c0 .793-.926.989-1.616.989l-1.086-2h2.202zm-1.441 3.506c.639 1.186.946 2.252.946 3.666 0 1.37-.397 2.533-1.005 3.981v1.847c0 .552-.448 1-1 1h-1.5c-.552 0-1-.448-1-1v-1h-13v1c0 .552-.448 1-1 1h-1.5c-.552 0-1-.448-1-1v-1.847c-.608-1.448-1.005-2.611-1.005-3.981 0-1.414.307-2.48.946-3.666.829-1.537 1.851-3.453 2.93-5.252.828-1.382 1.262-1.707 2.278-1.889 1.532-.275 2.918-.365 4.851-.365s3.319.09 4.851.365c1.016.182 1.45.507 2.278 1.889 1.079 1.799 2.101 3.715 2.93 5.252zm-16.059 2.994c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5zm10 1c0-.276-.224-.5-.5-.5h-7c-.276 0-.5.224-.5.5s.224.5.5.5h7c.276 0 .5-.224.5-.5zm2.941-5.527s-.74-1.826-1.631-3.142c-.202-.298-.515-.502-.869-.566-1.511-.272-2.835-.359-4.441-.359s-2.93.087-4.441.359c-.354.063-.667.267-.869.566-.891 1.315-1.631 3.142-1.631 3.142 1.64.313 4.309.497 6.941.497s5.301-.184 6.941-.497zm2.059 4.527c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5zm-18.298-6.5h-2.202c-.276 0-.5.224-.5.5v.511c0 .793.926.989 1.616.989l1.086-2z",
        strokeColor: '#000',
        fillColor: '#000',
        strokeOpacity: 1,
        strokeWeight: 1,
        fillOpacity: 1,
        anchor: new google.maps.Point(46, 70),
      }
    })

    new google.maps.Marker({
      position: route?.endPosition,
      map: mapRef.current,
      icon: {
        path:
          "M66.9,41.8c0-11.3-9.1-20.4-20.4-20.4c-11.3,0-20.4,9.1-20.4,20.4c0,11.3,20.4,32.4,20.4,32.4S66.9,53.1,66.9,41.8z    M37,41.4c0-5.2,4.3-9.5,9.5-9.5c5.2,0,9.5,4.2,9.5,9.5c0,5.2-4.2,9.5-9.5,9.5C41.3,50.9,37,46.6,37,41.4z",
        strokeColor: '#f2432',
        fillColor: '#f2432',
        strokeOpacity: 1,
        strokeWeight: 1,
        fillOpacity: 1,
        anchor: new google.maps.Point(46, 70),
      }
    })
  }, [routes, routeIdSelected])

  return (
    <Grid container>
      <Grid item xs={12} sm={3}>
        <form onSubmit={startRoute}>
          <Select
            fullWidth
            displayEmpty
            value={routeIdSelected}
            onChange={(event) => setRouteIdSelected(event.target.value as string)}
          >
            <MenuItem value=''>Selecione uma rota</MenuItem>
            {routes.map((route, key) => <MenuItem key={key} value={route.id}>{route.title}</MenuItem>)}
          </Select>

          <Button type='submit' color='primary' variant='contained'>
            Iniciar corrida
          </Button>
        </form>
      </Grid>
      <Grid item xs={12} sm={9}>
        <div id='map' style={{ width: '100%', height: '100vh' }}></div>
      </Grid>
    </Grid>
  )
}
