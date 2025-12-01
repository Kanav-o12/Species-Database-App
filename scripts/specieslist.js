//JSON dummy data
const dummyData = [
    {
        "id": "001",
        "scientific_name": "Albizia-lebbeck",
        "common_name": "Ai-Samatuku",
        "etymology": "Albizia honors Filippo degli Albizzi, who introduced an Albizia to Europe, and lebbeck comes from the local Arabic/Indic name “lebbek/labakh",
        "habitat": "The species grows along hilly roadsides at low to mid elevations.",
        "phenology": "Flowering: September–November; Fruiting: May–July",
        "identification_characters": "A medium–large, deciduous tree; bark grey, fissured and corky, leaves double pinnate with 2–4 pairs of pinnae, each bearing many small obliquely oblong leaflets (~1.5–6.5 × 0.5–3.5 cm); flowers in large, fragrant, fluffy, yellow-green spherical heads on long stalks; fruit is long, flat, papery-leathery pods , pale straw to light brown, swollen over the seeds and not constricted.",
        "leaf_type": "Pinnately compound (double)",
        "fruit_type": "Pod",
        "seed_germination": "Collect pods when they’re dry, light brown, and before they split; sun-dry a few days so they open, then clean and store seeds dry. Pre-treat by pouring just-boiled water over the seeds and soak 12–24 hours to soften the hard coat. Fill germination bed  with Soil : Sand : Compost in a 1:1:1 mix. Sow ~1 cm deep; in beds space seeds ~5 cm apart in rows, germination usually starts in about 1–2 weeks with fresh, pre-treated seed.",
        "image_url": "./Assets/Images/albizia-lebbeck/01.png"
    },
    {
        "id": "002",
        "scientific_name": "Azadirachta-indica",
        "common_name": "Sumaer Malae",
        "etymology": "Albizia honors Filippo degli Albizzi, who introduced an Albizia to Europe, and lebbeck comes from the local Arabic/Indic name “lebbek/labakh",
        "habitat": "The species grows along hilly roadsides at low to mid elevations.",
        "phenology": "Flowering: September–November; Fruiting: May–July",
        "identification_characters": "A medium–large, deciduous tree; bark grey, fissured and corky, leaves double pinnate with 2–4 pairs of pinnae, each bearing many small obliquely oblong leaflets (~1.5–6.5 × 0.5–3.5 cm); flowers in large, fragrant, fluffy, yellow-green spherical heads on long stalks; fruit is long, flat, papery-leathery pods , pale straw to light brown, swollen over the seeds and not constricted.",
        "leaf_type": "Pinnately compound (double)",
        "fruit_type": "Pod",
        "seed_germination": "Collect pods when they’re dry, light brown, and before they split; sun-dry a few days so they open, then clean and store seeds dry. Pre-treat by pouring just-boiled water over the seeds and soak 12–24 hours to soften the hard coat. Fill germination bed  with Soil : Sand : Compost in a 1:1:1 mix. Sow ~1 cm deep; in beds space seeds ~5 cm apart in rows, germination usually starts in about 1–2 weeks with fresh, pre-treated seed.",
        "image_url": "./Assets/Images/azadirachta-indica/01.png"
    }
]

//Render the Species list 
function renderSpecies(data){
    const speciesList = document.getElementById("species-list");
    speciesList.innerHTML = "";

    //loop for creating each element of species inside the list container
    data.forEach(species => {
        speciesList.innerHTML += `<div id="${species.id}" style="display:flex;margin-bottom:15px;border: 1px solid #ccc; border-radius: 8px; padding: 10px;" onclick="goToDetail(${species.id})">
        <img src="${species.image_url}" width="100" style="border-radius:8px;">
        <div>
        <h3 style="font-weight:500;margin-left:25px;">${species.scientific_name}</h3>
        <p style="color:grey;margin-left:25px;">${species.common_name}</p>
        </div>
        </div>`;
    });
}

renderSpecies(dummyData);

function goToDetail(id){
    //open the specific species detail page for the selected one
    //window.location.href = `specie.html?id=${id}`;
    window.location.href = "specie.html";
}