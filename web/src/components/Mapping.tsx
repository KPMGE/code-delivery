import { Button, Grid, MenuItem, Select } from "@material-ui/core"
import { FormEvent, useCallback, useEffect, useState } from "react"
import { Route } from "../utils/models";

const API_URL = process.env.REACT_APP_API_URL

export const Mapping = () => {
  const [routes, setRoutes] = useState<Route[]>([])
  const [routeIdSelected, setRouteIdSelected] = useState<string>('')

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

  const startRoute = useCallback((event: FormEvent) => {
    event.preventDefault()
    // console.log('routeIdSelected: ', routeIdSelected)
  }, [routeIdSelected])

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
      <Grid item xs={12} sm={3}>Mapa</Grid>
    </Grid>
  )
}
