# DINA-Web Core collection management system

[< Back to front](./)

Core collection management system collection management system is a web-based tool for managing natural history collections. It aims to make data entry and collection management efficient and effective. This can include managing new accessions, specimen digitization, collection reorganization and maintenance, yearly reporting, loans and other transactions.

It also will
- Provide better access to the collection data, for both museum employees and international community
- Be easily expandable to become a cross-disciplinary solution covering new collections and use cases
- Eventually replace all existing collection management systems at NRM

The system is being developed first for the mammal collection at NRM to replace their current system, then expanded to cover other types of collections also:

   - Zoological collections
   - Botanical collections
   - Geological collections
   - Paleontological collections
   - Molecular data (using SeqDB developed at Canada)


## Principles of the system

- Extendable for different disciplines and collections. Based on a platform (data model, database, API and user interface components) that is generic, so tha extending the system into new kinds for collections and uses is easy.
- Eventually usable by major Swedish museums, and other partners as agreed.
- Web-based: Works with modern web browsers, without requiring additional plugins.
- Open source: All source code and manuals made within the project is published online and licensed as open source.
- Supports several languages: UI will be in both English and Swedish, adding additional languages is possible.
- Data can be migrated into the system in a stepwise process, preventing the migration and data cleaning from becoming a bottleneck when taking the system into use with a new collection.
- Modern practices for IT and data security and software design are followed.
- Modular service-oriented architecture: DINA is an evolving ecosystem composed of independent modules that can be built using different technologies that communicate by RESTful JSON-API's. Modules are packaged into Docker-containers, which could be self-hosted if needed. The design is intended to facilitate module-independent and distrubuted development, and re-use of the modules.
- Project uses agile development methods, which aim for fast deployment using simple solutions, iterative development based on user feedback, and continuous improvement.



