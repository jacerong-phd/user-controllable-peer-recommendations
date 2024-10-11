import json
import numpy as np
import pandas as np

from app.schemas.messages import (
    MessageSchema
)
from app.schemas.people import (
    PersonSchema
)
from app.services.people import PersonService
from app.utils import read_data_file


class CommunityService():
    def __init__(self):
        self.messages = read_data_file('people-messages.json')

    def feed(self) -> list[MessageSchema]:
        schemas: list[MessageSchema] = []
        people: dict[int, PersonSchema] = {}

        for i, obj in enumerate(self.messages):
            if 'replies' not in obj:
                obj['replies'] = []

            messages = [obj] + obj.pop('replies')
            for j, message in enumerate(messages):
                person_id = message.pop('person_id')
                if person_id not in people:
                    people[person_id] = PersonService().get_person_by_id(person_id)

                message['person'] = people[person_id]

                if j == 0:
                    schemas.append(MessageSchema(**message))
                else:
                    schemas[i].replies.append(MessageSchema(**message))

        return schemas