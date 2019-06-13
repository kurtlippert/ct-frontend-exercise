// react
import * as React from 'react'
const r = React.createElement
import { render } from 'react-dom'
import { br, div, img, input, label, tbody, td, th, thead, tr } from 'react-dom-factories'

// redux
import { connect, Provider } from 'react-redux'
import { applyMiddleware, createStore, Store} from 'redux'
import { createEpicMiddleware, Epic, ofType } from 'redux-observable'

// rxjs
import { Observable } from 'rxjs'
// tslint:disable-next-line:no-submodule-imports
import { ajax } from 'rxjs/ajax'
// tslint:disable-next-line:no-submodule-imports
import { map, mergeMap } from 'rxjs/operators'

// react-bootstrap
import { Table } from 'react-bootstrap'

// model
interface Price {
  id: string,
  value: { currencyCode: string, centAmount: number },
}

interface MasterVariant {
  prices: Price[]
  images: { url: string }[]
}

interface ProductProjection {
  id: string,
  name: { de: string, en: string },
  masterVariant: MasterVariant,
  imageUrl: string,
}

interface State {
  search: string,
  productProjections: ProductProjection[]
}

// action
type Action =
  | { type: 'FETCH_PRODUCT_PROJECTIONS', search: string }
  | { type: 'FETCH_PRODUCT_PROJECTIONS_FULFILLED', search: string, productProjections: ProductProjection[] }

const fetchProductProjections = (search: string): Action => ({
  search,
  type: 'FETCH_PRODUCT_PROJECTIONS',
})

const fetchProductProjectionsFulfilled = (search: string, productProjections: ProductProjection[]): Action => ({
  productProjections,
  search,
  type: 'FETCH_PRODUCT_PROJECTIONS_FULFILLED',
})

interface EpicDependencies {
  getJSON: (url: string) => Observable<ProductProjection[]>,
}

export const fetchProductProjectionsEpic:
  Epic<Action, Action, State, EpicDependencies> =
  (action$, _, { getJSON }) =>
    action$.pipe(
      ofType('FETCH_PRODUCT_PROJECTIONS'),
      mergeMap((action) => {
        const { search } = action
        const query = search === '' ? 'users?' : `search/users?q=${search}&`
        return ajax.post(
          'https://auth.commercetools.co/oauth/token',
          { 'grant_type': 'client_credentials' },
          { 'Authorization': 'Basic ' + btoa(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET) }).pipe(
            map(({ response }: any) => response.access_token),
            mergeMap(token => {
              return ajax.get(
                'https://api.commercetools.co/frontend-engineering-exercise/product-projections?limit=5',
                { 'Authorization': 'Bearer ' + token }
              ).pipe(
                map(({ response }: { response: { results: ProductProjection[] } }) => {
                  return fetchProductProjectionsFulfilled('', response.results)
                })
              )
            }),
          )
      }),
    )

// reducers
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH_PRODUCT_PROJECTIONS_FULFILLED':
      return {
        ...state,
        search: action.search,
        productProjections: action.productProjections,
      }
    default:
      return state
  }
}

// tslint:disable-next-line:variable-name
const _home: React.SFC<{ state: State }> = ({ state }: { state: State }) =>
  div({},
    div({}, 'Product Projections'),
    br(),
    div({ className: 'form-group' },
      label({}, 'Filter'),
      input({
        className: 'form-control',
        onChange: (e: any) => store.dispatch(fetchProductProjections(e.target.value)),
      }),
    ),
    r(Table, { responsive: true },
      thead({},
        tr({},
          th({}, '#'),
          th({}, 'Name'),
          th({}, 'Value (cents)'),
          th({}, 'Image'),
        ),
      ),
      tbody({},
        (state.productProjections).map((productProjection: ProductProjection, index: number) =>
          tr({ key: productProjection.id },
            td({}, index),
            td({}, productProjection.name.en),
            td({},
              productProjection.masterVariant.prices
                .map(price => `${price.value.centAmount} ${price.value.currencyCode}`)[0]),
            td({},
              img({ src: productProjection.masterVariant.images[0].url, height: '32', width: '32' }),
            ),
          ),
        ),
      ),
    ),
  )

const home = connect(
  (state: State) => ({ state }),
)(_home)

interface RootProps {
  store: Store<State>
}

// tslint:disable-next-line:no-shadowed-variable
const Root: React.SFC<RootProps> = ({ store }) =>
  r(Provider, { store },
    div({ className: 'container mt-3' },
      r(home),
    ),
  )

const epicMiddleware = createEpicMiddleware<Action, Action, State, EpicDependencies>({
  dependencies: {
    getJSON: ajax.getJSON,
  },
})

const initialState: State = {
  search: '',
  productProjections: [],
}

const store: any = createStore(reducer, initialState, applyMiddleware(epicMiddleware))

epicMiddleware.run(fetchProductProjectionsEpic)

// render
render(
  r(Root, { store }),
  document.getElementById('root'),
)

store.dispatch(fetchProductProjections(initialState.search))
