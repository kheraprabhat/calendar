import Calendar from './components/Calendar';
import './App.css';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="calendar-app">
        <h1>
          Calendar
        </h1>
        <Calendar />
      </div>
    </QueryClientProvider>
  );
}

export default App;
