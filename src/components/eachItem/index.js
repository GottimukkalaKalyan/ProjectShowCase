import './index.css'

const EachProject = props => {
  const {data} = props
  const {name, imageUrl} = data
  return (
    <li className="project-container">
      <img src={imageUrl} alt={name} className="projectImage" />
      <p className="project-name">{name}</p>
    </li>
  )
}

export default EachProject
