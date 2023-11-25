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
