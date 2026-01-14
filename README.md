# Rai Matak Species Database App (English–Tetum)

**Product Owner:** Amy Stephenson, CEO  
**Technical Advisor:** Maniruddin Dhabak (Community Forestry)

---

## Overview

The **Rai Matak Species Database App** is an offline-capable mobile field guide developed to support the Rai Matak reforestation program in Timor-Leste.

It is designed for field staff, nursery workers, and community partners operating across thousands of smallholder farms, often in areas with unreliable or no internet access.

The app consolidates scattered PDFs, photos, and guides into a single **searchable, bilingual (English–Tetum) platform**, improving species identification accuracy, streamlining nursery management, and saving valuable time in the field.

---

## Rai Matak

*Rai Matak* translates to **“Green Land”** or **“Lush Earth”** in Tetum, reflecting the program’s mission to restore forest cover and biodiversity across Timor-Leste.

---

## Purpose

Field teams frequently work in remote locations with limited connectivity, leading to:

- Inconsistent species identification  
- Difficulty accessing reference materials  
- Information loss in the field  

This app provides a **simple, offline-first tool** that allows users to identify approved species by:

- Scientific name  
- Common name  
- Tetum name (*Naran Tetum*)  
- Leaf characteristics  
- Fruit type  

All key species information remains available **offline once installed**.

---

## Key Features

- **Bilingual Support (English & Tetum)**  
  All navigation and species content is available in both languages.

- **100% Offline Access**  
  Species data, images, and guides are stored locally on the device.

- **Species Identification**  
  Detailed profiles for native and priority species used in Rai Matak reforestation.

- **Rich Species Profiles**  
  Each profile includes:
  - Scientific and common names  
  - Tetum names  
  - Identification characteristics  
  - Habitat and ecological notes  
  - Local uses  
  - Seed germination and propagation SOPs  
  - Pests and diseases  
  - Photo galleries (leaf, bark, fruit, seedling stages)  
  - Tutorial videos where available  

- **Search & Filtering**  
  Quickly locate species by name, characteristic, or habitat.

---

## Dataset & Data Integrity

The system is backed by a curated **Excel-based dataset**, normalized and validated before being imported into the app.

### Validation Layers

1. **JSON Schema Validation**  
   Ensures structural consistency across records.

2. **Pydantic Validation**  
   Validates field types, required values, and custom rules using the `SpeciesRecord` model.

3. **Duplicate Detection**  
   Prevents duplicate scientific names to maintain dataset integrity.

---

## Command Line Interface (CLI)

The project includes a Python CLI to explore, validate, and audit the species dataset.

### Setup

```bash
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate  # macOS/Linux

pip install -r requirements.txt