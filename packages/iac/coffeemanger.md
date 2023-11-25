# HashiCups CDKTF Terraform Project

## Overview
This project integrates HashiCups with Terraform using the Cloud Development Kit for Terraform (CDKTF), managing infrastructure as code for a coffee ordering system.

## Structure
- **`packages/iac`**: Contains infrastructure as code using CDKTF for HashiCups.

## Setup

### Prerequisites
- Docker and Docker Compose
- Node.js and NPM
- Terraform

### Installation
1. Clone the repository.
2. Navigate to `packages/iac`.
3. Run `pnpm install` to install dependencies.

### Running the Application
1. Inside `packages/iac`, run `cdktf deploy` to apply Terraform configurations.
2. Launch HashiCups services: `docker-compose -f ./docker_compose/docker-compose.yaml up`.
3. Access HashiCups API at `http://localhost:19090`.

## Usage
Utilize the `MyCoffeeStand` and `OrderManager` classes for managing coffee orders and interacting with the HashiCups API.

## Development
- Extend functionality by modifying the `MyCoffeeStand` and `OrderManager` classes.
- Manage infrastructure changes using Terraform configurations in `packages/iac`.

## Challenges Encountered
During the development of this project, several challenges were faced:

1. **Architecture Compatibility**: The Mac used for development had a specific arm64 architecture, which was not compatible with the Terraform provider.
2. **Provider Accessibility**: Difficulty was encountered in pulling the Terraform provider, even when attempting to use an Ubuntu virtual machine.
3. **Data Source Limitations**: Both Coffee and Ingredient entities were implemented as Data Sources in Terraform, which complicated the creation of specific, unique coffee objects.
4. **Attribute Access**: Accessing necessary attributes for Data Sources proved challenging, as they were not directly exposed. It often required looping through specific objects or retrieving them through complex data types like 'any' and nested structures.
5. **Testing Complexities**: Encountered difficulties in setting up and running tests, particularly with managing the file paths and ensuring unique IDs in testing scenarios. This highlighted the need for careful structuring of tests to accurately reflect the application's behavior.
6. **Docker Configuration**: Faced issues with Docker Compose, especially in correctly mapping volumes and environment variables. This challenge underscored the importance of precise configuration to ensure smooth integration and running of services in containerized environments.

## Contributions
Contributions are welcome via issues or pull requests on GitHub.

## License
Licensed under MPL-2.0. See LICENSE file for details.

---

### Key Implementations
- **Coffee Order Management**: Programmatic handling of coffee orders using HashiCups API.
- **Local Environment Setup**: Docker Compose configuration for running HashiCups services locally.
- **CDKTF Infrastructure Management**: Infrastructure as code for setting up and managing the HashiCups application environment.

---

For detailed instructions and more information, visit the project repository on GitHub.
