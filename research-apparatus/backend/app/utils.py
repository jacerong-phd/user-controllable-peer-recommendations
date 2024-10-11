import json
import os
import re

import pandas as pd

from app.constants import DATA_PATH


def read_data_file(fname: str, data_dir: str = DATA_PATH) -> pd.DataFrame:
    fname = os.path.join(data_dir, fname)

    parsed_data = None

    if re.search(r'\.json', fname, re.I):
        with open(fname) as f:
            file_content = f.read()
        parsed_data = json.loads(file_content)
    elif re.search(r'\.csv', fname, re.I):
        parsed_data = pd.read_csv(fname)
    else:
        raise Exception('I do not recognize the file extension provided.')

    return parsed_data