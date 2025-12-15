from pydantic import BaseModel, Field, model_validator
from typing import List


class ImageItem(BaseModel):
    type: str
    file: str
    status: str

    @model_validator(mode="after")
    def check_cross_field_consistency(self):
        # Rule 1: Available image must have a file
        if self.status == "Available" and self.file in ["", "-", None]:
            raise ValueError(
                f"{self.type}: status is 'Available' but file is missing"
            )

        # Rule 2: Missing image must NOT have a real file
        if self.status == "Missing" and self.file not in ["", "-", None]:
            raise ValueError(
                f"{self.type}: status is 'Missing' but file is provided"
            )

        return self


class SpeciesEntry(BaseModel):
    species: str
    images: List[ImageItem]


# Example usage

if __name__ == "__main__":
    import json

    with open("image_mapping.json", "r") as f:
        data = json.load(f)

    errors = 0

    for entry in data:
        try:
            SpeciesEntry(**entry)
        except Exception as e:
            errors += 1
            print(f" Error in species {entry['species']}: {e}")

    if errors == 0:
        print(" No cross-field consistency errors found.")
