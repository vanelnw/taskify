import React from "react";
import { Todo } from "../model/todoModel";
import TodoItem from "./TodoItem";
import "../component/style.scss";
import { Droppable } from "react-beautiful-dnd";

interface Props {
  todos: Todo[];
  completedTodos: Todo[];
  handleDone: (t: Todo) => void;
  setCompletedTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  handleDone,
  completedTodos,
  setCompletedTodos,
}) => {

  return (
    <div className="container">
      <Droppable droppableId="TodoList">
        {(provided) => (
          <div
            className="todos"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <span className="todos-title">Active tasks</span>
            {todos &&
              todos.map((todo, index) => {
                return (
                  <TodoItem
                    index={index}
                    key={todo.id}
                    todo={todo}
                    todos={todos}
                    setTodos={setTodos}
                    handleDone={handleDone}
                  />
                );
              })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Droppable droppableId="CompletedList">
        {(provided) => (
          <div
            className="todos done"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <span className="todos-title">Completed tasks</span>
            {completedTodos ? (
              completedTodos.map((todo, index) => {
                return (
                  <TodoItem
                    index={index}
                    key={todo.id}
                    todo={todo}
                    todos={completedTodos}
                    setTodos={setCompletedTodos}
                  />
                );
              })
            ) : (
              <div>loading...</div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TodoList;
