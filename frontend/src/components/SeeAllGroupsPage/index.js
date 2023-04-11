import React, {useEffect} from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './SeeAllGroups.css';
import { getAllGroups } from '../../store/groupsThunk';


