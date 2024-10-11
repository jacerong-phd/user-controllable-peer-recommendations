from typing import Any

from fastapi import HTTPException

import numpy as np
import pandas as pd

from app.schemas.people import (
    PersonConditionSchema,
    PersonSchema,
    PersonSymptomSchema,
    PersonTreatmentSchema,
)
from app.services.treatments import TreatmentService
from app.services.auth import AuthService
from app.utils import read_data_file


class PersonService():
    def __init__(self):
        self.people = read_data_file('people.csv')
        self.people_conditions = read_data_file('people-conditions.csv')
        self.people_symptoms = read_data_file('people-symptoms.csv')
        self.people_treatments = read_data_file('people-treatments.csv')
        self.people_connections = read_data_file('people-connections.csv')
        self.interpersonal_similarities = read_data_file('interpersonal-similarities.csv')
        self.people_keywords = read_data_file('keywords.csv')

    def get_person_by_id(self, person_id: int) -> PersonSchema:
        q = self.people['id'] == person_id

        result = self.people \
            .loc[q] \
            .replace(np.nan, None) \
            .to_dict(orient='records')
        
        if len(result) == 0:
            raise HTTPException(status_code=404, detail="Person not found")
        
        user = AuthService().get_user(person_id=person_id)

        person = result[0]
        person.update(username=user.username)

        total_connections = self.get_person_total_connections(person_id)
        person.update(total_connections=total_connections)

        return PersonSchema(**person)
    
    def get_person_conditions(
        self, person_id: int
    ) -> list[PersonConditionSchema]:
        schemas: list[PersonConditionSchema] = list()

        q = self.people_conditions['person_id'] == person_id

        result = self.people_conditions \
            .loc[q] \
            .sort_values(by=['primary', 'condition'], ascending=[False, True]) \
            .to_dict(orient='records')

        # The person must have at least one condition.
        # Hence, if no conditions are found, raise an exception of type 404.
        if len(result) == 0:
            raise HTTPException(status_code=404, detail="Person not found")
        
        for person_condition in result:
            schemas.append(PersonConditionSchema(**person_condition))

        return schemas

    def get_person_symptoms(self, person_id: int) -> list[PersonSymptomSchema]:
        schemas: list[PersonSchema] = list()

        q = self.people_symptoms['person_id'] == person_id

        result = self.people_symptoms \
            .loc[q] \
            .replace(np.nan, "None") \
            .sort_values(by='symptom', ascending=True) \
            .to_dict(orient='records')

        for person_symptom in result:
            schemas.append(PersonSymptomSchema(**person_symptom))

        return schemas

    def get_person_treatments(
        self, person_id: int
    ) -> list[PersonTreatmentSchema]:
        schemas: list[PersonTreatmentSchema] = list()

        q = self.people_treatments['person_id'] == person_id

        result = self.people_treatments \
            .loc[q] \
            .sort_values(by=['treatment_id', 'purpose']) \
            .to_dict(orient='records')

        treatments = []
        for person_treatment in result:
            treatment_id = person_treatment['treatment_id']
            prescribed = person_treatment['prescribed']
            purpose = person_treatment['purpose']

            if treatment_id not in treatments:
                treatments.append(treatment_id)
                treatment = TreatmentService() \
                    .get_treatment_by_id(treatment_id)
                schemas.append(
                    PersonTreatmentSchema(
                        person_id=person_id,
                        treatment=treatment,
                        prescribed=prescribed,
                    )
                )

            if (
                purpose is None or
                not isinstance(purpose, str) or
                len(purpose) == 0
            ):
                continue

            index = treatments.index(treatment_id)
            schemas[index].purpose.append(purpose)

        return schemas

    def __get_person_connections(self, person_id: int) -> pd.DataFrame:
        q = (self.people_connections['person_id'] == person_id) | \
            (self.people_connections['peer_id'] == person_id)

        return self.people_connections.loc[q]

    def get_person_total_connections(self, person_id: int) -> int:
        result = self.__get_person_connections(person_id)

        return result.shape[0]

    def get_person_connections(self, person_id: int) -> list[dict[str, Any]]:
        connections: list = list()

        result = self.__get_person_connections(person_id) \
            .sort_values(by=['person_id', 'peer_id']) \
            .to_dict(orient='records')

        for connection in result:
            peer_id = (
                connection['peer_id'] if connection['person_id'] == person_id
                else connection['person_id']
            )

            peer = self.get_person_by_id(peer_id)

            connections.append({
                'id': peer_id,
                'username': peer.username,
                'gender': peer.gender,
                'age': peer.age,
            })

        return connections

    def check_person_connection(
        self, person_id: int, peer_id: int
    ) -> bool:
        """Check if `person_id` and `peer_id` are connected to each other."""
        q = self.people_connections['person_id'].isin([person_id, peer_id]) & \
            self.people_connections['peer_id'].isin([person_id, peer_id])

        result = self.people_connections.loc[q]

        return True if result.shape[0] > 0 else False

    def get_peer_recommendations(
        self,
        person_id: int,
        engine: str,
        demographics: float = None,
        clinical: float = None,
        lifestyle: float = None,
        conditions: float = 1,
        symptoms: float = 1,
        treatments: float = 1,
        size: int | None = None,
    ) -> list[dict[str, Any]]:
        recommendations: list = list()

        q = (self.interpersonal_similarities['person_id'] == person_id) | \
            (self.interpersonal_similarities['peer_id'] == person_id)

        df = self.interpersonal_similarities \
            .loc[q] \
            .replace(np.nan, 0)

        # As every user must have their similarity with every other user
        # computed, if there is no record of a given user, it is because
        # they do not exist.
        if df.shape[0] == 0:
            raise HTTPException(status_code=404, detail="Person not found")

        clinical_sim = (conditions * df['conditions']) + \
            (symptoms * df['symptoms']) +\
            (treatments * df['treatments'])
        clinical_sim /= (conditions + symptoms + treatments)

        df = df \
            .assign(clinical=clinical_sim.values) \
            .drop(columns=['conditions', 'symptoms', 'treatments'])

        if engine == 'likeness':
            similarity = (demographics * df['demographics']) + \
                (clinical * df['clinical']) + \
                (lifestyle * df['lifestyle'])
            similarity /= (demographics + clinical + lifestyle)
            df = df.assign(similarity=similarity.values)
        else:
            df = df.rename(columns={'clinical': 'similarity'})

        # Exclude from the recommendations users with whom a connection has
        # already been established.
        peers = self.__get_person_connections(person_id)
        peers = np.concatenate((peers['person_id'], peers['peer_id']))
        peers = np.unique(peers)

        q = (~df['person_id'].isin(peers)) | (~df['peer_id'].isin(peers))

        df = df \
            .loc[q] \
            .sort_values(by=['similarity'], ascending=[False], ignore_index=True)

        for i, row in enumerate(df.to_dict(orient='records')):
            if isinstance(size, int) and i == size:
                break

            peer_id = (
                row['peer_id'] if row['person_id'] == person_id
                else row['person_id']
            )

            peer = self.get_person_by_id(peer_id)

            common_attr = self.__get_common_attributes(
                person_id,
                peer_id,
                True if engine == 'clinical' else False
            )
            common_attr = [] if common_attr is None else common_attr

            recommendations.append({
                'id': peer_id,
                'username': peer.username,
                'gender': peer.gender,
                'age': peer.age,
                'location': peer.location,
                'interpersonal_similarity' : row['similarity'],
                'common_attributes': common_attr,
            })

        return recommendations

    def __get_person_keywords(self, person_id: int) -> pd.DataFrame | None:
        col_to_exclude = ["demographics/age"]

        q = (self.people_keywords['person_id'] == person_id) & \
            (~self.people_keywords['type'].isin([col_to_exclude]))

        return self.people_keywords.loc[q]

    def __get_common_attributes(
        self,
        person_id: int,
        peer_id: int,
        only_clinical: bool = False,
    ) -> list | None:
        person_keywords = self.__get_person_keywords(person_id)
        peer_keywords = self.__get_person_keywords(peer_id)

        if (person_keywords.shape[0] == 0 or
                peer_keywords.shape[0] == 0):
            return

        person_keywords = person_keywords \
            .drop(columns=['person_id', 'derived'])
        peer_keywords = peer_keywords \
            .drop(columns=['person_id', 'derived'])

        common_attr = pd \
            .merge(
                person_keywords,
                peer_keywords,
                how='inner',
                on=['keyword', 'type']
            ) \
            .drop_duplicates()

        if only_clinical:
            q = common_attr['type'].str.startswith('clinical')
            common_attr = common_attr.loc[q]

        common_attr = common_attr \
            .sort_values(by=['type', 'keyword'], ignore_index=True) \
            .rename(columns={'keyword': 'attribute'})

        return common_attr.to_dict(orient='records')