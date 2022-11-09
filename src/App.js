
import 'antd/dist/antd.css';
import './App.css';
import TodoForm from './todoForm/TodoForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <h1>TODOS</h1>
      <TodoForm />
      <ToastContainer style={{ fontSize: 'medium' }} />
    </div>
  );
}

export default App;
