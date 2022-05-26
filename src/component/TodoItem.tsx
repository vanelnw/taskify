import React, { useState } from "react";
import { Todo } from "../model/todoModel";
import { AiOutlineClose, AiOutlineCheck } from "react-icons/ai";
import axios from "axios";
import { API_URL } from "../config";
import { Draggable } from "react-beautiful-dnd";

interface Props {
  index: number;
  todo: Todo;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  handleDone?: (t: Todo) => void;
}

const TodoItem: React.FC<Props> = ({
  index,
  todo,
  setTodos,
  todos,
  handleDone,
}) => {
  const handleDelete = (id: number) => {
    axios.delete<Todo[]>(`${API_URL}/${id}`).then((res) => {
      console.log("delete successful");
    });
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const [isShown, setIsShown] = useState(false);

  return (
    <Draggable draggableId={todo.id.toString()} index={index}>
      {(provided) => (
        <div
          className="todoItem"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div
            className="blocName"
            onMouseOver={() => setIsShown(true)}
            onMouseLeave={() => setIsShown(false)}
            onClick={() => handleDone && handleDone(todo)}
          >
            {todo.isDone ? (
              <>
                <AiOutlineCheck className="doneIcon" />
                <s>{todo.name.toUpperCase()}</s>
              </>
            ) : (
              <>
                <div className={isShown ? "iconShow" : "iconHide"}></div>
                <span>{todo.name.toUpperCase()}</span>
              </>
            )}
          </div>
          <span className="icon">
            <AiOutlineClose onClick={() => handleDelete(todo.id)} />
          </span>
        </div>
      )}
    </Draggable>
  );
};

export default TodoItem;
