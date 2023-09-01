import {Component} from 'react'
import './App.css'
import Loader from 'react-loader-spinner'

import EachProject from './components/eachItem'
import Header from './components/header'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

// Replace your code here
class App extends Component {
  state = {
    allProjects: [],
    apiStatus: apiStatusConstants.initial,
    activeCategory: categoriesList[0].id,
  }

  componentDidMount() {
    this.getProjects()
  }

  changeCategory = event => {
    this.setState({activeCategory: event.target.value}, this.getProjects)
  }

  getProjects = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {activeCategory} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeCategory}`
    const response = await fetch(url)
    console.log(response)
    const data = await response.json()
    if (response.ok) {
      const updatedData = data.projects.map(eachProject => ({
        id: eachProject.id,
        imageUrl: eachProject.image_url,
        name: eachProject.name,
      }))
      console.log(updatedData)
      this.setState({
        allProjects: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
      console.log('Fail')
    }
  }

  getResult = apiStatus => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.getSuccessView()
      case apiStatusConstants.failure:
        return this.getFailureView()
      case apiStatusConstants.inProgress:
        return this.GetLoadingView()
      default:
        return null
    }
  }

  getSuccessView = () => {
    const {allProjects} = this.state
    return (
      <ul className="project-list-container">
        {allProjects.map(eachOne => (
          <EachProject data={eachOne} key={eachOne.id} />
        ))}
      </ul>
    )
  }

  getFailureView = () => (
    <div className="failed-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failed-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.getProjects}>
        Retry
      </button>
    </div>
  )

  GetLoadingView = () => (
    <div className="loading-container" data-testid="loader">
      <Loader type="ThreeDots" width="50px" height="50px" color="black" />
    </div>
  )

  render() {
    const {allProjects, apiStatus, activeCategory} = this.state
    return (
      <>
        <Header />

        <div className="home-page-main-container">
          <div className="select-tag-container">
            <select
              className="selectTag"
              value={activeCategory}
              onChange={this.changeCategory}
            >
              {categoriesList.map(each => (
                <option value={each.id} key={each.id}>
                  {each.displayText}
                </option>
              ))}
            </select>
          </div>
          <div className="home-page-content-container">
            {this.getResult(apiStatus)}
          </div>
        </div>
      </>
    )
  }
}

export default App
