// TODO: mangle all keys
const archetype = { entities: new Set() };
// archetype = { ...archetype, next, prev, first, last }
export default archetype;

// Do I need to make fixed sized Archetype 🤔
/* Memory Layout

ComponentGroup   = [[...component1, ...component2], [...component1, ...component3], [...component2, ...component??...]]
Archetype        = (offset) => [...entityIDs, ...componentGroup]
Buffer           = [...Archetypes, ...sparseArchetypeOffsetIndexer]

*/


/** https://ajmmertens.medium.com/building-an-ecs-2-archetypes-and-vectorization-fe21690805f9

// Entities, types and entity index
using EntityId = uint64_t;
using Type = vector<EntityId>;
unordered_map<EntityId, Type> entity_index;// Type flags

// Type flags
const EntityId INSTANCEOF = 1 << 63;
const EntityId CHILDOF = 2 << 62;// Component data

// Component data
struct ComponentArray {
    void *elements; // vector<T>
    int size;
};

// Archetype graph
struct Archetype;

struct Edge {
    Archetype *add;
    Archetype *remove;
};

struct Archetype {
    Type type;
    vector<EntityId> entity_ids;
    vector<ComponentArray> components;
    int length;
    vector<Edge> edges;
};

Archetype *node = root;
for (int i = 0; i < type.size(); i ++) {
   Edge *edge = &node->edges[type[i]];
   if (!edge->add) {
       edge->add = create_archetype(node, type[i]);
   }

   node = edge->add;
}

--------------------------------------------------------

struct Record {
    Archetype *archetype;
    int row;
};

unordered_map<EntityId, Record> entity_index;

Record& r = entity_index[10];
Type& type = r.archetype->type;for (int i = 0; i < type.size(); i ++) {
    if (type[i] == A) {
        return r.archetype->components[i].elements[r.row];
    }
}

*/
