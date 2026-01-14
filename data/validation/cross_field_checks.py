from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, ValidationError, model_validator
import json


#  Strict Enums
class ImageType(str, Enum):
    LEAF = "Leaf"
    FLOWER = "Flower"
    SEED = "Seed"
    HABITAT = "Habitat"
    BARK = "Bark"


class ImageStatus(str, Enum):
    AVAILABLE = "Available"
    MISSING = "Missing"


class ImageItem(BaseModel):
    type: ImageType
    file: Optional[str] = Field(default="-")
    status: ImageStatus

    @model_validator(mode="after")
    def check_cross_field_consistency(self):
        file_clean = (self.file or "").strip()

        # Rule 1: Available image must have a real filename
        if self.status == ImageStatus.AVAILABLE and file_clean in ["", "-", "None"]:
            raise ValueError(f"{self.type.value}: status is 'Available' but file is missing")

        # Rule 2: Missing image must NOT have a real filename
        if self.status == ImageStatus.MISSING and file_clean not in ["", "-", "None"]:
            raise ValueError(f"{self.type.value}: status is 'Missing' but file is provided")

        # Optional: check allowed extensions when Available
        if self.status == ImageStatus.AVAILABLE:
            allowed_ext = (".jpg", ".jpeg", ".png", ".webp")
            if not file_clean.lower().endswith(allowed_ext):
                raise ValueError(f"{self.type.value}: unsupported file extension (allowed: {allowed_ext})")

        return self


class SpeciesEntry(BaseModel):
    species: str
    images: List[ImageItem]


def print_table(rows):
    headers = ["species", "type", "status", "file", "result", "notes"]
    print("| " + " | ".join(headers) + " |")
    print("| " + " | ".join(["---"] * len(headers)) + " |")
    for r in rows:
        print("| " + " | ".join(str(r.get(h, "")).replace("|", "\\|") for h in headers) + " |")


if __name__ == "__main__":
    with open("image_mapping.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    rows = []
    errors = 0

    for entry in data:
        species = entry.get("species", "unknown")
        try:
            validated = SpeciesEntry(**entry)

            # PASS rows
            for img in validated.images:
                rows.append({
                    "species": species,
                    "type": img.type.value,
                    "status": img.status.value,
                    "file": img.file,
                    "result": "PASS",
                    "notes": ""
                })

        except ValidationError as ve:
            errors += 1
            # FAIL summary + details
            rows.append({
                "species": species,
                "type": "",
                "status": "",
                "file": "",
                "result": "FAIL",
                "notes": "ValidationError"
            })
            for err in ve.errors():
                loc = " -> ".join(str(x) for x in err.get("loc", []))
                msg = err.get("msg", "")
                rows.append({
                    "species": species,
                    "type": "",
                    "status": "",
                    "file": "",
                    "result": "FAIL",
                    "notes": f"{loc}: {msg}"
                })

    print_table(rows)

    if errors == 0:
        print("\nNo cross-field consistency errors found.")
    else:
        print(f"\nValidation finished with errors. Species entries with issues: {errors}")
