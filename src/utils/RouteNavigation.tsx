import {createRef} from 'react';

export const isMountedRef: any = createRef();
export const navigationRef: any = createRef();

export function navigate(name: any, params: any) {
  if (isMountedRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current.navigate(name, params);
  } else {
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}

export function getCurrentRoute() {
  const rootState = navigationRef.current.getRootState();
  let route = rootState.routes[rootState.index];

  while (route.state) {
    route = route.state.routes[route.state.index];
  }
  return route;
}
