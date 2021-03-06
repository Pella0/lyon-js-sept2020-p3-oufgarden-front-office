/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import './style/GardenInfos.scss';
import { Link } from 'react-router-dom';
import FetchActionToZones from './FetchActionToZone';

import { getEntity, getCollection } from '../services/API';

const URL = process.env.REACT_APP_API_BASE_URL;

const GardenInfos = (props) => {
  const {
    match: {
      params: { id },
    },
  } = props;
  const [gardenInfos, setGardenInfos] = useState([]);
  const [actionList, setActionList] = useState([]);
  const [gardenZone, setGardenZone] = useState([]);
  const [zoneActionOpen, setZoneActionOpen] = useState({});

  const toggleDisplayZone = (zoneId) => {
    setZoneActionOpen((openZone) => {
      return { ...openZone, [zoneId]: !openZone[zoneId] };
    });
  };

  useEffect(() => {
    getCollection('actions').then((elem) => {
      setActionList(elem);
    });
  }, []);
  useEffect(() => {
    getEntity('garden', id).then((data) => {
      setGardenInfos(data);
    });
  }, []);
  useEffect(() => {
    if (gardenInfos) {
      getCollection(`garden/${id}/zones`).then((elem) => {
        setGardenZone(elem);
      });
    }
  }, []);
  return (
    <div className="garden-list-container-infos">
      <div key={id} className="garden-row-infos">
        <div className="whitebar-infos">
          <div className="back-home-infos">
            <Link className="link-back-feed-garden" to="/garden">
              <div className="back-arrow-infos" />
              <div className="back-infos">Retour</div>
            </Link>
          </div>
        </div>
        {gardenInfos.picture && (
          <img
            className="imgGarden-infos"
            src={`${URL}/${gardenInfos.picture}`}
            alt="jardin"
          />
        )}
        <div className="detailsGarden">
          <h3>{gardenInfos.name}</h3>
          <p>{gardenInfos.description}</p>
          <p>Exposition : {gardenInfos.exposition}</p>
          <p>
            Adresse : {gardenInfos.street} {gardenInfos.zip_code}{' '}
            {gardenInfos.city}
          </p>
        </div>

        <div className="gardenActionContainer">
          <div className="gardenAction">
            {actionList.map((e, i) => {
              return (
                <Link
                  to={`/garden/${id}/action/${e.id}`}
                  className={`action-${e.name}`}
                  key={i}
                >
                  <div className="imageActionContainer">
                    <div
                      key={e.id}
                      type="image"
                      alt="action"
                      contentEditable="false"
                    />
                    <div className="nameAction">
                      <p>{e.name}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="gardenZoneContainer">
          <p className="titleZoneContainer">
            Voir les actions effectuées pour chaque zone les 7 derniers jours
          </p>
          {gardenZone &&
            gardenZone.map((e) => {
              return (
                <div key={e.id} className="gardenZoneRow">
                  <button type="button" onClick={() => toggleDisplayZone(e.id)}>
                    {e.name}
                  </button>
                  {zoneActionOpen[e.id] && (
                    <FetchActionToZones gardenId={id} gardenZone={e.id} />
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
export default GardenInfos;
