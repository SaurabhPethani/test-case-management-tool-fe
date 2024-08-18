import { useEffect } from 'react';
import api from './api';
import { useNavigation } from '../components/NavigationContext';

const AxiosInterceptorComponent = () => {
  const { navigate } = useNavigation();

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => {
        console.log("Response in interceptor ",response)
        return response;
      },
      (error) => {
        console.log("Error in interceptor ",error)
        if (error.response && error.response.status === 401) {
          navigate('/login');
          return Promise.reject(error);
        }
        return error.response;
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  return null;
};

export default AxiosInterceptorComponent;
