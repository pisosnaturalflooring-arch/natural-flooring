# Natural Flooring Wood Recommender Design

## Objective

Add a new standalone interactive assistant that helps users quickly find the safest material option for their project, then explains why, and finally lets them explore the broader Natural Flooring catalog.

This assistant should feel warm, simple, and premium rather than technical or form-like. It must reduce decision anxiety for users who do not know wood species or construction materials.

## Product Goals

- Help users describe their project without needing prior material knowledge.
- Recommend the safest option for the user’s real context, not the most aspirational one.
- Keep the recommendation inside Natural Flooring’s commercial universe: natural wood, WPC, SPC, vinyl, coverings, stairs, and related solutions they already offer.
- Present the answer in clear, everyday language.
- Maintain a visually strong, responsive, low-friction experience.

## Experience Principles

### Usability

- One question per step.
- At most 2 to 5 options per screen.
- No mandatory free-text input in the main flow.
- Persistent progress indicator.
- Clear back navigation without losing answers.
- Large tap targets for mobile.

### Nielsen Heuristics

- **Visibility of system status:** always show current step and progress.
- **Match between system and the real world:** use familiar phrasing such as "interior seco" or "exterior expuesto", not technical jargon.
- **User control and freedom:** allow moving backward and changing earlier choices.
- **Recognition rather than recall:** use selectable options instead of expecting users to know species or product families.
- **Aesthetic and minimalist design:** show only one decision at a time.
- **Help users recognize and understand results:** explain recommendations in simple cause/effect language.

### Cognitive Design

- Reduce cognitive load by chunking decisions into short sequential steps.
- Defer aesthetic preference until after the technical recommendation is mostly resolved.
- Use progressive disclosure: first resolve the safest family, then show alternatives and full catalog.
- Avoid decision paralysis by returning one primary recommendation, not a broad ranking.

## Visual Direction

### Visual Thesis

Warm, tactile, and calm. The assistant should feel like a guided material consultation framed by wood grain, soft light, and premium restraint.

### Layout Thesis

This should not appear as a boxed form in the middle of the page. The assistant should live on its own route or dedicated section with:

- a broad immersive canvas
- soft material-inspired background planes
- subtle grain or tonal texture
- generous whitespace
- a single dominant action per view

### Style Notes

- Base palette: warm neutrals, sand, oak, walnut, charcoal accents.
- Avoid cold SaaS gradients and generic dashboard cards.
- Use photography or cropped material surfaces where possible.
- Keep type simple and elegant; the copy should do orientation, not decoration.
- Motion should be restrained: step transitions, progress shifts, and result reveal.

## Scope

### In Scope

- A dedicated interactive recommendation flow.
- A final result with one primary recommendation.
- Context-aware alternatives from the same material family or adjacent solutions.
- A follow-up section for exploring all available woods/materials.
- Support for multiple project types.

### Out of Scope

- Instant pricing engine.
- Inventory, stock, or lead-time promises.
- Highly technical educational content inside the main flow.
- Direct comparison matrix of every species.

## Natural Flooring Offer Model

Based on the captured marketplace and folder evidence, the assistant should assume that Natural Flooring works with the following offer groups:

### Primary material groups

- Natural wood floors
- Natural wood decks
- WPC decks
- SPC floors
- Vinyl floors
- Stairs
- Wood or decorative coverings
- Baseboards and finish accessories

### Material/species signals observed

- Lapacho
- Viraro
- Eucalipto Grandis
- Kiri
- Petiribi
- Guatambu
- WPC
- SPC
- Vinyl

### Service signals observed

- Pulido
- Plastificado
- Hidrolaqueado
- Repair/renovation work
- Cleaning and maintenance products

The recommender should be built on a configurable data model so these species and families can be adjusted later without redesigning the experience.

## Recommended Product Strategy

The assistant should be technically honest, but brand-aligned.

That means:

- If natural wood is the safest option, recommend a concrete species.
- If WPC, SPC, or vinyl is genuinely safer for the stated use, say so.
- Keep the explanation warm and simple, never defensive.
- Present nearby alternatives from Natural Flooring’s catalog after the primary result.

This protects trust and prevents forcing a wood recommendation into cases where another family is better.

## Interaction Model

The assistant should behave like a guided consultation, not a form wizard.

### Core interaction rules

- One fullscreen or near-fullscreen step at a time.
- Options rendered as large selectable tiles or buttons.
- Current answer animates into the next step.
- A concise summary of prior answers can appear in a small secondary strip or be hidden until the result.
- No need for users to type unless a future optional contact CTA is added.

## Flow Design

The flow should have a maximum of 6 steps, with adaptive branching depending on project type.

### Step 1: Project Type

Prompt:

`Para que lo necesitas?`

Options:

- Piso interior
- Deck exterior
- Escalera
- Revestimiento / pared
- No estoy seguro

This is the main branch selector.

If the user chooses `No estoy seguro`, the next step should help classify the use with a simpler prompt such as:

- Quiero revestir un piso
- Quiero resolver un exterior
- Quiero renovar una escalera
- Quiero revestir una pared o una superficie vertical

### Step 2: Exposure Context

Prompt:

`Donde va a estar?`

Generic answer set:

- Interior seco
- Interior con algo de humedad
- Exterior semicubierto
- Exterior expuesto

This step may be reduced or relabeled for project types where some answers do not apply.

### Step 3: Use Intensity

Prompt:

`Que nivel de uso va a tener?`

Options:

- Bajo
- Medio
- Alto
- Muy alto

### Step 4: Main Priority

Prompt:

`Que queres priorizar?`

Options:

- Durabilidad
- Mantenimiento simple
- Apariencia natural
- Resistencia a humedad

### Step 5: Material Openness

Prompt:

`Estas buscando solo madera natural o preferis que te recomendemos lo mas seguro?`

Options:

- Solo madera natural
- Madera o alternativas si conviene
- No se, recomendame lo mas seguro

### Step 6: Aesthetic Preference

Prompt:

`Hay algun look que te guste mas?`

Options:

- Claro
- Medio
- Oscuro
- Rustico
- Sin preferencia

This step must not override the technical logic. It only helps bias the final suggestion within a safe set.

## Recommendation Logic

The recommendation should be computed in this order:

1. Project type
2. Humidity or exposure
3. Use intensity
4. User priority
5. Material openness
6. Aesthetic preference

The system should return one primary recommendation with optional adjacent suggestions.

## Initial Recommendation Matrix

This matrix is intentionally simple for v1. It is enough to support a strong first release and can later expand into a more detailed ruleset.

### Exterior deck, exposed

Primary safe options:

- Lapacho
- WPC deck

Decision bias:

- If user prioritizes natural look and accepts maintenance: Lapacho
- If user prioritizes simpler maintenance: WPC

### Interior floor, medium/high traffic

Primary safe options:

- Lapacho
- Viraro

Decision bias:

- More resistance-forward: Lapacho
- More warmth/premium visual balance: Viraro

### Stairs

Primary safe options:

- Petiribi
- Viraro
- Lapacho

Decision bias:

- Heavier wear or more technical requirement: Lapacho
- Warm visual result and strong residential fit: Petiribi or Viraro

### Coverings / walls

Primary safe options:

- Kiri
- Other light decorative wood solutions from the catalog

Decision bias:

- Use Kiri when low weight and visual warmth make sense.

### Humidity-sensitive interior case

Primary safe options:

- SPC
- Vinyl
- WPC where applicable

Decision bias:

- If the context is less friendly to natural wood and the user allows alternatives, recommend the safer synthetic family honestly.

## Result Screen Design

The result should feel calm, reassuring, and actionable.

### Result structure

#### 1. Primary statement

`La opcion mas segura para tu caso es Lapacho.`

Or equivalent for WPC/SPC/vinyl.

#### 2. Simple explanation

Explain the recommendation in non-technical language, for example:

`Te lo recomendamos porque responde mejor al uso y a las condiciones del espacio que otras opciones mas delicadas.`

#### 3. Related alternatives

Show 2 or 3 adjacent options, for example:

- Viraro
- Petiribi
- Deck WPC

These alternatives should stay in the same decision universe and not create confusion.

#### 4. What we took into account

Show a short summary of answers:

- Tipo de proyecto
- Ubicacion
- Nivel de uso
- Prioridad

This increases trust and explainability.

#### 5. Next step CTA

Primary CTA examples:

- Quiero asesoramiento con esta opcion
- Ver materiales disponibles

## Tone of Voice

The result must sound warm, calm, and clear.

### Guidelines

- Avoid sounding clinical or academic.
- Do not surface specialist metrics in the main recommendation.
- Translate technical reality into everyday language.

### Good examples

- `Tolera mejor la humedad`
- `Es una opcion mas practica para el uso diario`
- `Funciona mejor en exterior`
- `Requiere mas mantenimiento que otras alternativas`

### Bad examples for primary copy

- Janka hardness
- Dimensional stability coefficient
- Moisture content indexes

These can exist in structured data later, but not in the first-layer UX.

## All Materials Section

This section should appear after the result, not inside the questionnaire itself.

Its purpose is exploration after the user’s main doubt has already been resolved.

Even though the user may think in terms of "maderas", the implementation should support both wood species and adjacent families that Natural Flooring also sells.

### Positioning

Intro heading:

`Tambien trabajamos estas maderas y opciones`

### Structure

1. Short intro
2. Simple filters
3. Visual material list
4. CTA to request guidance

### Filters

- Pisos
- Decks
- Escaleras
- Revestimientos
- Madera natural
- WPC
- SPC / vinilico

If product language needs to stay even simpler, these can be relabeled in the UI without changing the underlying taxonomy.

### Material entry content

Each entry should contain:

- name
- best use
- maintenance level
- interior / exterior marker
- tone or visual family
- one short phrase explaining fit

Example:

`Lapacho`
`Ideal para decks y pisos exigentes`

### Presentation

Do not use a generic marketplace grid as the primary visual model.

Prefer:

- larger image-led rows or panels
- editorial grouping
- curated spacing
- low UI chrome

This should feel like a designed material library, not a product dump.

## Other Solutions Section

Because Natural Flooring also appears to offer non-species services and complementary categories, these should live in a separate block from the material library.

Suggested group:

- Zocalos
- Escaleras
- Pulido e hidrolaqueado
- Limpieza y mantenimiento

Suggested heading:

`Otras soluciones que tambien hacemos`

## Responsive Behavior

### Mobile

- One dominant interaction per viewport
- Thumb-friendly option buttons
- Sticky progress/header kept minimal
- Result content stacked vertically

### Tablet/Desktop

- Wider composition
- More breathing room
- Optional side image plane or material texture plane
- Result can use two columns if it improves scanning

The experience must remain equally understandable on mobile and desktop.

## Accessibility

- Sufficient contrast over textured backgrounds
- Clear focus states for keyboard navigation
- Visible selected state on all options
- Motion should be subtle and non-essential
- All progress and answers should be available to assistive tech

## Content Constraints

- Keep instructions short.
- Do not overload each step with educational text.
- Avoid promising “the best material”.
- Use “la opcion mas segura para tu caso”.

## Data Model Requirements

The implementation should be driven by data, not hardcoded copy spread through UI components.

At minimum, each material should support:

- id
- label
- family
- applicable project types
- humidity suitability
- traffic suitability
- maintenance profile
- natural vs alternative flag
- tone tags
- explanation snippets
- related alternatives

This allows the assistant and the catalog section to stay synchronized.

## Success Criteria

- Users can complete the assistant quickly without knowing any species.
- The result feels trustworthy and understandable.
- The recommendation logic can select wood or alternative materials honestly.
- The result naturally leads into exploration or consultation.
- The visual experience feels branded, warm, and responsive.

## Suggested Implementation Phasing

### Phase 1

- Build the standalone assistant shell
- Implement the 6-step flow
- Add a simple rules-based recommendation engine
- Render one primary recommendation plus alternatives

### Phase 2

- Add the curated “all materials” section
- Improve imagery and transitions
- Expand material metadata and logic

### Phase 3

- Add consultation CTA integrations
- Add analytics on completion and recommendation outcomes
- Refine taxonomy as Natural Flooring’s catalog evolves

## Risks and Mitigations

### Risk: The catalog mixes wood with non-wood solutions

Mitigation:
Keep recommendation logic family-aware and explain when a non-wood option is safer.

### Risk: Users may expect a species even when wood is not ideal

Mitigation:
Use warm explanatory language and show nearby alternatives after the primary result.

### Risk: Too much marketplace-like UI weakens brand perception

Mitigation:
Use editorial composition and larger visual groupings instead of a raw card grid.

### Risk: The material matrix may change

Mitigation:
Keep species and material rules in configuration data.
