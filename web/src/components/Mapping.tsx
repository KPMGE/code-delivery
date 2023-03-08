import { Button, Grid, makeStyles, MenuItem, Select } from "@material-ui/core"
import { Loader } from "google-maps";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react"
import { getCurrentPositon } from "../utils/geolocation";
import { makeCarIcon, makeMarkerIcon, Map } from "../utils/map";
import { Route, RouteData } from "../utils/models";
import { sample } from 'lodash'
import { useSnackbar } from "notistack";
import { RouteExistsError } from "../errors/route-exists-error";
import { NavBar } from "./NavBar";
import io from 'socket.io-client'

const API_URL = process.env.REACT_APP_API_URL
const googleMapsLoader = new Loader(process.env.REACT_APP_GOOGLE_API_KEY)

const colors = [
  "#b71c1c",
  "#4a148c",
  "#2e7d32",
  "#e65100",
  "#2962ff",
  "#c2185b",
  "#FFCD00",
  "#3e2723",
  "#03a9f4",
  "#827717",
];

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100%',
  },
  form: {
    margin: '16px',
  },
  btnSubmitWrapper: {
    textAlign: 'center',
    marginTop: '8px'
  },
  map: {
    width: '100%',
    height: '100%',
  },
})

export const Mapping = () => {
  const styles = useStyles()
  const [routes, setRoutes] = useState<Route[]>([])
  const [routeIdSelected, setRouteIdSelected] = useState<string>('')
  const mapRef = useRef<Map>()
  const socketIoRef = useRef<any>()
  const { enqueueSnackbar } = useSnackbar()

  const finishRoute = useCallback((route: Route) => {
    mapRef.current?.removeRoute(route.id)

    enqueueSnackbar(`${route.title} finished`, {
      variant: 'success'
    })
  }, [enqueueSnackbar])


  useEffect(() => {
    if (!socketIoRef.current?.connected) {
      socketIoRef.current = io(API_URL, { transports: ['websocket'] });
      socketIoRef.current.on('connect', () => console.log('websocket connected!'))
    }

    const handler = (data: RouteData) => {
      console.log('data on handler: ', data)

      mapRef.current?.moveCurrentMarker(data.routeId, {
        lat: data.position[0],
        lng: data.position[1]
      })

      const route = routes.find(route => route.id === data.routeId) as Route
      if (data.finished) {
        finishRoute(route)
      }
    }

    socketIoRef.current?.on('new-position', handler)
    return () => {
      socketIoRef.current?.off('new-position', handler)
    }

  }, [finishRoute, routes, routeIdSelected])


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
      mapRef.current = new Map(divMap, {
        zoom: 15,
        center: position
      })
    })()
  }, [])

  const startRoute = useCallback((event: FormEvent) => {
    event.preventDefault()
    const route = routes.find(route => route.id === routeIdSelected)
    const randomColor = sample(colors) as string

    try {
      mapRef.current?.addRoute(routeIdSelected, {
        currentMarkerOptions: {
          position: route?.startPosition,
          icon: makeCarIcon(randomColor)
        },
        endMarkerOptions: {
          position: route?.endPosition,
          icon: makeMarkerIcon(randomColor)
        }
      })


      socketIoRef.current.emit('new-direction', {
        routeId: routeIdSelected
      })
    } catch (error) {
      if (error instanceof RouteExistsError) {
        enqueueSnackbar(`${route?.title} already added, wait it to finish`, {
          variant: 'error'
        })
        return
      }
      throw error
    }
  }, [routes, routeIdSelected, enqueueSnackbar])

  return (
    <Grid className={styles.root} container>
      <Grid item xs={12} sm={3}>
        <NavBar />
        <form onSubmit={startRoute} className={styles.form}>
          <Select
            fullWidth
            displayEmpty
            value={routeIdSelected}
            onChange={(event) => setRouteIdSelected(event.target.value as string)}
          >
            <MenuItem value=''>Selecione uma rota</MenuItem>
            {routes.map((route, key) => <MenuItem key={key} value={route.id}>{route.title}</MenuItem>)}
          </Select>

          <div className={styles.btnSubmitWrapper}>
            <Button type='submit' color='primary' variant='contained'>
              Iniciar corrida
            </Button>
          </div>
        </form>
      </Grid>
      <Grid item xs={12} sm={9}>
        <div id='map' className={styles.map}></div>
      </Grid>
    </Grid>
  )
}
