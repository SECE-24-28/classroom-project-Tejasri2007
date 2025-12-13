import { useRef } from "react";

function SimpleForm() {
  const nameRef = useRef("");

  const handleSubmit = (e) => {
    e.preventDefault(); // prevents default page reload
    const name = nameRef.current.value; // Access the input value directly
    alert("Your name is: " + name);
    nameRef.current.value = ""; // Clear the input
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Enter your name" ref={nameRef} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default SimpleForm;
