import React from 'react';
import {render, screen} from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';
import {store} from './store';
import {Provider} from 'react-redux';

test('renders app', () => {
  render(
    <Provider store={store}>
      <App/>
    </Provider>
  );
  const linkElement = screen.getByText(/The free-to-play way to earn more/i);
  expect(linkElement).toBeInTheDocument();
});
