# Requirements Document

## Introduction

This document specifies the requirements for implementing dual-mode pizza selection functionality in the Next.js pizza ordering application. The system currently supports only 2x1 pizza selection mode and needs to be enhanced to support both 2x1 mode and single pizza selection mode, allowing users to choose their preferred ordering experience.

## Glossary

- **Pizza_Selection_System**: The component responsible for displaying and managing pizza selection modes
- **Mode_Selector**: The UI component that allows users to choose between 2x1 and single pizza modes
- **Pizza_Card**: The individual pizza display component showing pizza information and pricing
- **Pizza_Modal**: The detailed view component that appears when a pizza is selected in single mode
- **Size_Selector**: The component that allows users to choose pizza sizes (CH, MED, GDE, FAM)
- **Notes_Field**: The textarea component for additional pizza customization notes
- **Navigation_Handler**: The component responsible for routing users to appropriate pages based on selection mode

## Requirements

### Requirement 1: Mode Selection Interface

**User Story:** As a customer, I want to choose between 2x1 promotion and single pizza ordering, so that I can select the ordering option that best fits my needs.

#### Acceptance Criteria

1. WHEN a user visits the pizzas page, THE Pizza_Selection_System SHALL display two selection options in the header section
2. WHEN the 2x1 mode is selected, THE Pizza_Selection_System SHALL highlight the 2x1 option and show 2x1-specific pizza information
3. WHEN the single pizza mode is selected, THE Pizza_Selection_System SHALL highlight the single pizza option and show single pizza information
4. THE Mode_Selector SHALL maintain the selected state visually until the user changes it
5. THE Pizza_Selection_System SHALL default to 2x1 mode to preserve current user experience

### Requirement 2: 2x1 Mode Display (Enhanced Current Functionality)

**User Story:** As a customer, I want to see pizzas in 2x1 promotion format, so that I can take advantage of the two-for-one offer.

#### Acceptance Criteria

1. WHEN 2x1 mode is active, THE Pizza_Card SHALL display only CH and MED sizes with their respective prices
2. WHEN 2x1 mode is active, THE Pizza_Card SHALL show the "2x1" promotional badge
3. WHEN a pizza is selected in 2x1 mode, THE Navigation_Handler SHALL route the user to the "/2x1" page
4. WHEN 2x1 mode is active, THE Pizza_Selection_System SHALL store the selected pizza name in localStorage
5. THE Pizza_Card SHALL display pizza name, ingredients, and promotional pricing in 2x1 format

### Requirement 3: Single Pizza Mode Display

**User Story:** As a customer, I want to see individual pizza pricing for all sizes, so that I can order a single pizza with full size options.

#### Acceptance Criteria

1. WHEN single pizza mode is active, THE Pizza_Card SHALL display all four sizes (CH, MED, GDE, FAM) with their respective prices
2. WHEN single pizza mode is active, THE Pizza_Card SHALL NOT display the "2x1" promotional badge
3. WHEN single pizza mode is active, THE Pizza_Card SHALL show pricing in the format "CH $199, MED $279, GDE $309, FAM $349"
4. WHEN a pizza is selected in single pizza mode, THE Pizza_Modal SHALL open with detailed pizza information
5. THE Pizza_Card SHALL maintain the same visual design and layout regardless of mode

### Requirement 4: Single Pizza Modal Interface

**User Story:** As a customer, I want to see detailed pizza information and add customization notes, so that I can make an informed decision and personalize my order.

#### Acceptance Criteria

1. WHEN a pizza is selected in single pizza mode, THE Pizza_Modal SHALL display the pizza name and ingredients
2. WHEN the modal opens, THE Pizza_Modal SHALL show all four sizes with individual prices in a clear format
3. WHEN the modal is displayed, THE Notes_Field SHALL be available for customer customization input
4. WHEN the modal is open, THE Pizza_Modal SHALL provide options to close or proceed with the order
5. THE Pizza_Modal SHALL display information in the format: "Pizza Name - Ingredients - Size Options with Prices"

### Requirement 5: Size and Price Display Management

**User Story:** As a customer, I want to see appropriate pricing information based on my selected mode, so that I understand the cost structure for my chosen ordering method.

#### Acceptance Criteria

1. WHEN displaying prices, THE Pizza_Selection_System SHALL use the prices from the especialidades2x1 configuration
2. WHEN in 2x1 mode, THE Pizza_Card SHALL show only CH ($199) and MED ($279) prices
3. WHEN in single pizza mode, THE Pizza_Card SHALL show all prices: CH ($199), MED ($279), GDE ($309), FAM ($349)
4. THE Pizza_Selection_System SHALL format prices consistently with currency symbol and proper spacing
5. WHEN mode changes, THE Pizza_Selection_System SHALL update all displayed prices immediately

### Requirement 6: Navigation and State Management

**User Story:** As a customer, I want the system to handle my selections appropriately based on the chosen mode, so that I am directed to the correct next step in the ordering process.

#### Acceptance Criteria

1. WHEN 2x1 mode is active and a pizza is selected, THE Navigation_Handler SHALL navigate to "/2x1" page
2. WHEN single pizza mode is active and a pizza is selected, THE Pizza_Modal SHALL open without navigation
3. WHEN storing selection data, THE Pizza_Selection_System SHALL include the selected mode information
4. WHEN the page loads, THE Pizza_Selection_System SHALL restore the previously selected mode if available
5. THE Navigation_Handler SHALL maintain backward compatibility with existing 2x1 page functionality

### Requirement 7: User Interface Consistency

**User Story:** As a customer, I want the interface to remain visually consistent and intuitive, so that I can easily navigate between different selection modes.

#### Acceptance Criteria

1. WHEN switching modes, THE Pizza_Selection_System SHALL maintain the existing responsive grid layout
2. WHEN mode changes occur, THE Pizza_Card SHALL preserve its hover effects and animations
3. WHEN displaying different modes, THE Pizza_Selection_System SHALL use consistent typography and color schemes
4. THE Mode_Selector SHALL integrate seamlessly with the existing header design
5. WHEN the modal is open, THE Pizza_Modal SHALL follow the existing design system and component patterns

### Requirement 8: Data Integration and Compatibility

**User Story:** As a system administrator, I want the new functionality to work with existing data structures, so that no data migration or restructuring is required.

#### Acceptance Criteria

1. THE Pizza_Selection_System SHALL use the existing especialidades2x1 array from menu.config.ts
2. WHEN accessing pizza data, THE Pizza_Selection_System SHALL use the existing price structure (CH, MED, GDE, FAM)
3. WHEN storing selections, THE Pizza_Selection_System SHALL maintain compatibility with existing localStorage usage
4. THE Pizza_Selection_System SHALL preserve all existing pizza properties (name, ingredients, prices)
5. WHEN integrating with existing components, THE Pizza_Selection_System SHALL not break current Header and Footer functionality