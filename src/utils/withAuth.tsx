import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const withAuth = (Component: any) => {
  const AuthenticatedComponent = (props: any) => {

    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem('token');

      if (!token) {
        // Token not present, redirect to login
        navigate("/login");
        return;
      }

      fetch('http://128.199.147.135:3002//validate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
        .then(async (response) => {
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message);
          }
          return response.json();
        })
        .then((data) => {
          console.log(data.message);
        })
        .catch((error) => {
          console.error(error);
          navigate("/login");;
        });
    }, []);

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
