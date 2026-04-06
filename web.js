import { useEffect, useState } from "react";
import API from "../services/api";

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    API.get("projects/")
      .then((res) => {
        setProjects(res.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>Projects</h1>

      {projects.map((project) => (
        <div key={project.id}>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Projects;