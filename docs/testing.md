# Testing Strategy & Test Execution

## Verification Test Suite (32 Test Cases)

The project includes an automated test suite located at `tests/run_all_tests.ts`.

### Running Tests
```bash
npm test
# or
npx tsx tests/run_all_tests.ts
```

### Covered Test Domains:
1. **Analytical Formula & Progress Engine (T01 - T10)**:
   - Bounds verification (0% <= E <= 100%)
   - Weight normalization constraint ($\sum W_i = 1.0$)
   - Uncertainty interval computation
   - Monotonic stage progression
   - Component structural score calculation
   - Heavy machinery density bonus

2. **Database Repository & CRUD Operations (T11 - T23)**:
   - Schema initialization & file-backed persistence
   - Full-text search and keyword matching
   - Asset class, status, and condition filtering
   - Entity creation, retrieval, updates, and deletion
   - Inspection appending with automated velocity delta computation

3. **Analytics & Geospatial GIS Engine (T24 - T30)**:
   - Portfolio summary aggregation
   - Status sub-counts integrity
   - RFC 7946 GeoJSON FeatureCollection compliance
   - Valid longitude [-180, 180] and latitude [-90, 90] bounds

4. **Model Registry & Provenance (T31 - T32)**:
   - Model catalog integrity
   - Academic un-trained state reporting
