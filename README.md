# User-Controllable Peer Recommendations in Online Health Communities
This repository contains the data collected and the software artifacts created for the article "User-Controllable Peer Recommendations in Online Health Communities."

## 1. The application (research apparatus)
The application is built in two parts. The frontend, created with React Native, is the user interface with which participants interact. The backend, a REST API built on top of Python and FastAPI, handles the business logic. No database management system but a collection of flat files (in CSV format) is used. Install the application using the "research-apparatus/README.md" file.

## 2. Jupyter notebooks (for analyses)
Two Jupyter notebooks, in R and Python, perform path analysis and analysis of variance. The data to be analyzed are the ratings participants gave to the three application versions.

## 3. Datasets
We collected three datasets for the user study. A description of each is provided below.

### 3.1 Community
As mentioned in the article, we used a dataset of 25 individuals with cardiovascular disease to recreate an online health community and generate peer recommendations. The dataset originated from an unpublished study exploring everyday self-care strategies among individuals with this group of heart and blood vessel conditions. Locate the dataset in the "research-apparatus/backend/data" path.

### 3.2 Pre-study survey
Through an online survey, we asked participants for their gender identity and age and information about their diagnoses, symptoms, treatments, and lifestyles. With this data, we created application users for them.

**Note:** This dataset is not publicly available since we had to remove participants' personal health information as soon as they evaluated the application.

### 3.3 Participant ratings
This dataset consists of the ratings participants gave to the application versions. As mentioned above, the ratings are the data the Jupyter notebooks analyze. Locate the dataset in the "analyses/data" path.

## 4. License
The software artifacts, namely the application source code and the Jupyter notebooks, are licensed under the MIT license (find a copy in the repository root). The [Creative Commons Attribution 4.0 International license](https://creativecommons.org/licenses/by/4.0/) applies to the datasets.
