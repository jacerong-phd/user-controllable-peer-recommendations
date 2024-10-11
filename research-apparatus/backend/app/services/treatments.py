import numpy as np

from app.schemas.treatments import TreatmentSchema
from app.utils import read_data_file


class TreatmentService():
    def __init__(self):
        self.treatments = read_data_file('treatments.csv') \
            .astype({'parent_id': 'Int64'})

    def get_treatment_by_id(
        self,
        treatment_id: int,
        depth: int = 0,
        max_depth: int = 1,
    ) -> TreatmentSchema | None:
        q = self.treatments['id'] == treatment_id

        result = self.treatments \
            .loc[q] \
            .replace(np.nan, None) \
            .to_dict(orient='records')

        if len(result) == 0:
            return None
        
        treatment = result[0]

        treatment['name'] = treatment.pop('treatment')
        treatment['parent'] = treatment.pop('parent_id')

        if treatment['parent'] is not None and depth < max_depth:
            treatment['parent'] = self.get_treatment_by_id(
                treatment['parent'],
                depth=(depth + 1),
            )
        elif treatment['parent'] is not None:
            treatment['parent'] = None

        return TreatmentSchema(**treatment)
