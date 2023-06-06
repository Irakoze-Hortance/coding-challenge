"use client";
import { useState, useEffect } from "react";
import Todo from "@/component/Todo";
import {
  ADD_TODO,
  DELETE_ALL_COMPLETED,
  DELETE_TODO,
  FETCH_TODO_LIST,
  FETCH_TODO_LIST_BY_STATUS,
  UPDATE_TODO,
} from "@/queries";
import TodoType from "@/interface/TodoType";

const activeStyles = `border-blue-600 dark:border-blue-500 text-blue-200`;

export default function Home() {
  const [filteredTodos, setFilteredTodos] = useState<any[]>([]);
  const [pageStatus, setPageStatus] = useState("ALL");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    toggleTodosStatus("ALL");
  }, []);

  // Create todo
  const createTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === "") {
      alert("Please enter a valid task name");
      return;
    }

    const newTodo = await ADD_TODO(input);

    if (pageStatus === "ALL" || pageStatus === "ACTIVE") {
      setFilteredTodos((prevTodos) => [...prevTodos, newTodo]);
    }

    setInput("");
  };

  // Update todo
  const toggleComplete = async (todoId: string) => {
    try {
      const updatedTodo = await UPDATE_TODO(parseInt(todoId));
      setIsLoading(true);
      if (updatedTodo) {
        // Update todo in UI
        setFilteredTodos((prevTodos) =>
          prevTodos.map((todo) => {
            if (todo.id === todoId) {
              return updatedTodo;
            }
            return todo;
          })
        );
      } else {
        // Handle update failure
        console.log(`Failed to update todo with ID ${todoId}.`);
      }
    } catch (e: any) {
    } finally {
      setIsLoading(false);
    }
  };

  // Delete todo
  const handleDeleteTodo = async (todoId: string) => {
    try {
      const deletedTodo = await DELETE_TODO(parseInt(todoId));
      if (deletedTodo) {
        // Remove deleted todo from UI
        setFilteredTodos((prevTodos) =>
          prevTodos.filter((todo) => todo.id !== todoId)
        );
        // Handle successful deletion
        console.log(`Todo with ID ${todoId} has been deleted:`, deletedTodo);
      } else {
        // Handle deletion failure
        console.log(`Failed to delete todo with ID ${todoId}.`);
      }
    } catch (error) {
    }
  };

  // Delete all completed todos
  const handleDeleteAllCompletedTodos = async () => {
    try {
      const deletedTodos = await DELETE_ALL_COMPLETED();
      if (deletedTodos) {
        // Remove deleted todos from UI
        setFilteredTodos((prevTodos) =>
          prevTodos.filter((todo) => !todo.completed)
        );
      }
    } catch (error) {
      // Handle error if necessary
    }
  };

  // Update the list according to the status
  const toggleTodosStatus = async (status: string) => {
    setPageStatus(status);
    try {
      setIsLoading(true);
      if (status === "ALL") {
        const list = await FETCH_TODO_LIST();
        setFilteredTodos(list);
      } else {
        const list = await FETCH_TODO_LIST_BY_STATUS(
          status === "COMPLETE" ? true : false
        );
        setFilteredTodos(list);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="max-w-[500px] w-full p-4">
        <h3 className="text-3xl font-bold text-center p-2">TODO-BAG</h3>
        <form onSubmit={createTodo} className="flex items-center mb-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="rounded-l-lg py-2 px-4 outline-none border"
            type="text"
            placeholder="Add Todo"
          />
        </form>
        <button className="rounded-lg text-white py-2 px-4 bg-green-300">
  ADD TASK
</button>


        <div>
          <div className="text-md font-medium text-center">
            <ul className="flex flex-wrap -mb-px">
              <li
                className={`mr-6 cursor-pointer ${
                  pageStatus === "ALL" ? activeStyles : ""
                }`}
                onClick={() => toggleTodosStatus("ALL")}
              >
                ALL TASKS
              </li>
              <li
                className={`mr-6 cursor-pointer ${
                  pageStatus === "ACTIVE" ? activeStyles : ""
                }`}
                onClick={() => toggleTodosStatus("ACTIVE")}
              >
                ONGOING
              </li>
              <li
                className={`mr-2 cursor-pointer ${
                  pageStatus === "COMPLETE" ? activeStyles : ""
                }`}
                onClick={() => toggleTodosStatus("COMPLETE")}
              >
                DONE
              </li>
            </ul>
          </div>
          <table className="w-full">
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={2} className="p-4">
                    <div className="flex items-center">
                      <div className="h-4 w-4 bg-gray-300 rounded-full mr-3"></div>
                      <div className="h-4 w-10 bg-gray-300 rounded-md"></div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTodos.map((todo: TodoType, index: number) => (
                  <Todo
                    key={parseInt(todo.id)}
                    todo={todo}
                    idx={index}
                    isLoading={isLoading}
                    toggleComplete={toggleComplete}
                    deleteTodo={handleDeleteTodo}
                  />
                ))
              )}
            </tbody>
          </table>
          <div className="pt-4">
            {filteredTodos.filter((todo) => todo.completed).length > 0 && (
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow"
                onClick={() => handleDeleteAllCompletedTodos()}
              >
                Clear Completed Todos
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
