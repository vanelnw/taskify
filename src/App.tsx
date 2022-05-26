import React, { useEffect, useState } from "react";
import "./App.css";
import InputField from "./component/InputField";
import TodoList from "./component/TodoList";
import { Todo } from "./model/todoModel";
import "./component/style.scss";
import axios from "axios";
import {API_URL} from './config'
import { DragDropContext, DropResult } from "react-beautiful-dnd";

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
   const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (todo) {
      axios.post(
        `${API_URL}`
        ,{ id: Date.now(), name: todo, isDone: false }
      );
      setTodos([...todos, { id: Date.now(), name: todo, isDone: false }]);
    }
    setTodo("");
  };

   const handleDone = async (todo: Todo) => {
     const newTodos = {
       id: todo.id,
       name: todo.name,
       isDone: true,
     };
     await axios.put<Todo[]>(`${API_URL}/${todo.id}`, newTodos).then((res) => {
       console.log("update successful");
     });

     setTodos(todos.filter((tod) => tod.id !== todo.id));
     setCompletedTodos(completedTodos.concat([newTodos]));
   };

  const onDragEnd = (result:DropResult) => {
    const { source, destination } = result;

    let add, active = todos, complete=completedTodos

    if (!destination) return;
    if (
      destination?.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;
    
    if (source.droppableId === "TodoList") {
      add = active[source.index];
      active.splice(source.index, 1);
    } else {
      add = complete[source.index];
      complete.splice(source.index, 1);
    }

    if (destination.droppableId === "TodoList") { 
      add.isDone = false;
      active.splice(destination.index,0,add)
    } else {
      add.isDone = true
      complete.splice(destination.index, 0, add);
      handleDone(add)
    }

    setCompletedTodos(complete);
    setTodos(active);

  }

  useEffect(() => {
    axios.get<Todo[]>(`${API_URL}`).then((res) => {
      if (res.data) {
        setTodos(res.data.filter(t => t.isDone === false));
        setCompletedTodos(res.data.filter(t => t.isDone === true))
      } 
      console.log(res.data)
    });
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="root">
        <div className="title">Taskify</div>
        <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
        <TodoList
          todos={todos}
          setTodos={setTodos}
          handleDone={handleDone}
          completedTodos={completedTodos}
          setCompletedTodos={setCompletedTodos}
        />
      </div>
    </DragDropContext>
  );
};

export default App;
