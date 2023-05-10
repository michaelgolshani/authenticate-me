// SeeAllGroupsPage.js
import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './SeeAllGroupsPage.css'

import { getAllGroupsThunk, addGroupImageThunk } from '../../store/groups';

export default function GetAllGroups() {
  const dispatch = useDispatch()
  const history = useHistory()

  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSearchNames, setFilteredSearchNames] = useState([]);

  useEffect(() => {
    dispatch(getAllGroupsThunk())
  }, [dispatch])


  const groupSelector = useSelector((state) => state.group.allGroups)
  const groups = Object.values(groupSelector)



  console.log("GET ALL GROUPS", groups)
  console.log("FILTERED GROUP NAMES", filteredSearchNames)
  console.log("SEARCH TERM", searchTerm)
  console.log("SEARCH QUERY", searchQuery)


  const handleGroupClick = (groupId) => {
    history.push(`/groups/${groupId}`)
  }


  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("SUBMITTING")
    setSearchQuery(searchTerm)



    const filteredGroups = groups.filter((group) => {

      const searchTermLower = searchTerm.toLowerCase();

      console.log("SEARCH TERM LOWER", searchTermLower)

      return (
        group.name.toLowerCase().includes(searchTermLower) ||
        group.city.toLowerCase().includes(searchTermLower) ||
        group.state.toLowerCase().includes(searchTermLower)
      );
    });


    setFilteredSearchNames(filteredGroups)
    setSearchTerm('')
    // setSearchQuery('')
  };




  return (
    <div className="group-list-container">

      <div className="group-list-header">
        <NavLink to='/events' className="group-list-header" activeClassName='active'>
          Events
        </NavLink>
        <NavLink to='/groups' className="group-list-header" activeClassName='active'>
          Groups
        </NavLink>
        {/* <input
          type="text"
          placeholder="Search for a group"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        /> */}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='details-page-search-input'
          />
          <button type="submit" className='get-events-groups-search-button'>Search</button>
        </form>

      </div>

      <div className="group-list-caption">Groups in Meetup</div>
      {searchQuery ? (
        filteredSearchNames.map((group) => (
          <div key={group.id} className="group-list-item" onClick={() => handleGroupClick(group.id)}>

            <div className="group-list-thumbnail">
              <img src={group.previewImage} className='group-list-thumbnail group-list-photo' />
            </div>

            <div className="group-info">

              <div className="group-name">
                {group.name}
              </div>

              <div className="group-location">
                {group.city}
              </div>

              <div className="group-description">
                {group.about}
              </div>

              <div className="group-events-private">
                events · {group.private === false ? 'Public' : 'Private'}
              </div>

            </div>
          </div>
        ))
      ) : (groups.map((group) => (
        <div key={group.id} className="group-list-item" onClick={() => handleGroupClick(group.id)}>

          <div className="group-list-thumbnail">
            <img src={group.previewImage} className='group-list-thumbnail group-list-photo' />
          </div>

          <div className="group-info">

            <div className="group-name">
              {group.name}
            </div>

            <div className="group-location">
              {group.city}
            </div>

            <div className="group-description">
              {group.about}
            </div>

            <div className="group-events-private">
              events · {group.private === false ? 'Public' : 'Private'}
            </div>

          </div>
        </div>
      )))}
    </div>
  )
}
