import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './contexts/User.contexts';
import { UsersListProvider } from './contexts/UsersList.contexts';
import { SubjectsProvider } from './contexts/Subjects.contexts';
import { ClassroomsProvider } from './contexts/Classrooms.contexts';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <UsersListProvider>
            <SubjectsProvider>
              <ClassroomsProvider>
                <App />
              </ClassroomsProvider>
            </SubjectsProvider>
          </UsersListProvider>
        </UserProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
