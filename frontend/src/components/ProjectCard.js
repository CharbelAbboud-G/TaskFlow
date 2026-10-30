import Link from "next/link";

export default function ProjectCard({ project }) {
  return (
    <article>
      <h2>{project.title}</h2>

      <p>{project.description}</p>

      <p>
        <strong>Status:</strong> {project.status}
      </p>

      <Link href={`/projects/${project.id}`}>
        View Details
      </Link>
    </article>
  );
}