# Design Document: Pizza Selection Modes

## Overview

This design implements dual-mode pizza selection functionality for the Next.js pizza ordering application. The system will enhance the existing PizzasPage component to support both 2x1 promotional mode and single pizza selection mode, providing users with flexible ordering options while maintaining backward compatibility with the current 2x1 workflow.

The design leverages React's useState hook for mode management, shadcn/ui Dialog component for modal interactions, and maintains the existing responsive grid layout and design system consistency.

## Architecture

### Component Hierarchy

```
PizzasPage (Enhanced)
├── Header (Existing)
├── ModeSelector (New)
│   ├── Toggle Button (2x1 Mode)
│   └── Toggle Button (Single Mode)
├── PizzaGrid (Enhanced)
│   └── PizzaCard[] (Enhanced)
│       ├── PizzaInfo (Enhanced)
│       ├── PriceDisplay (Enhanced)
│       └── PromotionalBadge (Conditional)
├── PizzaModal (New)
│   ├── PizzaDetails
│   ├── SizeSelector
│   ├── NotesField
│   └── ActionButtons
└── Footer (Existing)
```

### State Management Architecture

The application will use local component state with useState for mode management:

```typescript
type SelectionMode = '2x1' | 'single'

interface PizzaSelectionState {
  mode: SelectionMode
  selectedPizza: string | null
  isModalOpen: boolean
}
```

### Data Flow

1. **Mode Selection**: User selects mode → State updates → UI re-renders with appropriate pricing
2. **2x1 Flow**: Pizza selection → localStorage storage → Navigation to /2x1
3. **Single Flow**: Pizza selection → Modal opens → User interaction → Order processing

## Components and Interfaces

### ModeSelector Component

**Purpose**: Provides toggle interface for switching between 2x1 and single pizza modes

**Interface**:
```typescript
interface ModeSelectorProps {
  currentMode: SelectionMode
  onModeChange: (mode: SelectionMode) => void
}
```

**Behavior**:
- Renders two toggle buttons with active state styling
- Integrates seamlessly with existing header design
- Provides visual feedback for selected mode
- Maintains accessibility with proper ARIA labels

### Enhanced PizzaCard Component

**Purpose**: Displays pizza information with mode-appropriate pricing and interaction

**Interface**:
```typescript
interface PizzaCardProps {
  pizza: Pizza
  mode: SelectionMode
  onPizzaSelect: (pizzaName: string) => void
}

interface Pizza {
  name: string
  ingredients: string
  prices: {
    CH: number
    MED: number
    GDE: number
    FAM: number
  }
}
```

**Behavior**:
- **2x1 Mode**: Shows CH and MED prices, displays 2x1 badge, navigates on click
- **Single Mode**: Shows all four sizes with prices, opens modal on click
- Maintains existing hover effects and animations
- Preserves responsive grid layout

### PizzaModal Component

**Purpose**: Provides detailed pizza information and customization interface for single pizza mode

**Interface**:
```typescript
interface PizzaModalProps {
  pizza: Pizza | null
  isOpen: boolean
  onClose: () => void
  onOrderConfirm: (orderDetails: SinglePizzaOrder) => void
}

interface SinglePizzaOrder {
  pizzaName: string
  size: PizzaSize
  notes: string
  price: number
}

type PizzaSize = 'CH' | 'MED' | 'GDE' | 'FAM'
```

**Behavior**:
- Uses shadcn/ui Dialog component for accessibility and focus management
- Displays pizza name, ingredients, and all size options with prices
- Provides textarea for customization notes
- Includes size selection interface
- Handles order confirmation and modal closure

### Enhanced PizzasPage Component

**Purpose**: Main container component managing mode state and coordinating child components

**Interface**:
```typescript
interface PizzasPageState {
  mode: SelectionMode
  selectedPizza: Pizza | null
  isModalOpen: boolean
}
```

**Key Methods**:
- `handleModeChange(mode: SelectionMode)`: Updates selection mode and re-renders UI
- `handlePizzaSelection(pizzaName: string)`: Handles pizza selection based on current mode
- `handle2x1Selection(pizzaName: string)`: Stores selection and navigates to /2x1
- `handleSingleSelection(pizza: Pizza)`: Opens modal with pizza details
- `handleModalClose()`: Closes modal and resets selection state

## Data Models

### Pizza Data Structure

The existing pizza data structure from `config/menu.config.ts` will be used without modification:

```typescript
interface Pizza {
  name: string
  ingredients: string
  prices: {
    CH: number    // Chica - $199
    MED: number   // Mediana - $279
    GDE: number   // Grande - $309
    FAM: number   // Familiar - $349
  }
}
```

### Mode Configuration

```typescript
const MODE_CONFIG = {
  '2x1': {
    displayName: '2x1 Promoción',
    description: 'Dos pizzas al precio de una',
    visibleSizes: ['CH', 'MED'] as const,
    showBadge: true,
    navigationTarget: '/2x1'
  },
  'single': {
    displayName: 'Pizza Individual',
    description: 'Ordena una pizza con todos los tamaños disponibles',
    visibleSizes: ['CH', 'MED', 'GDE', 'FAM'] as const,
    showBadge: false,
    navigationTarget: null
  }
} as const
```

### Price Display Formatting

```typescript
interface PriceDisplayConfig {
  mode: SelectionMode
  sizes: readonly PizzaSize[]
  formatStyle: 'compact' | 'detailed'
}

// 2x1 Mode: "CH $199 • MED $279"
// Single Mode: "CH $199, MED $279, GDE $309, FAM $349"
```

Now I need to use the prework tool to analyze the acceptance criteria before writing the correctness properties:

<function_calls>
<invoke name="prework">
<parameter name="featureName">pizza-selection-modes

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Mode Selection State Management
*For any* selection mode ('2x1' or 'single'), when that mode is selected, the system should update the UI to highlight the selected mode and display mode-appropriate pizza information consistently across all pizza cards.
**Validates: Requirements 1.2, 1.3, 1.4**

### Property 2: Price Display Based on Mode
*For any* pizza and selection mode, the displayed prices should match the mode configuration: 2x1 mode shows only CH and MED prices, while single mode shows all four sizes (CH, MED, GDE, FAM) with prices from the especialidades2x1 configuration.
**Validates: Requirements 2.1, 3.1, 5.1, 5.2, 5.3**

### Property 3: Promotional Badge Conditional Display
*For any* pizza card, the "2x1" promotional badge should be visible if and only if the current mode is '2x1'.
**Validates: Requirements 2.2, 3.2**

### Property 4: Mode-Based Navigation Behavior
*For any* pizza selection, the system should navigate to "/2x1" page when in 2x1 mode, and open the pizza modal without navigation when in single mode.
**Validates: Requirements 2.3, 3.4, 6.1, 6.2**

### Property 5: Data Storage Consistency
*For any* pizza selection, the system should store the selection data in localStorage with the correct format, including mode information and pizza name when in 2x1 mode.
**Validates: Requirements 2.4, 6.3, 8.3**

### Property 6: Price Formatting Consistency
*For any* displayed price, the format should be consistent with currency symbol and proper spacing (e.g., "$199" not "199$" or "$ 199").
**Validates: Requirements 5.4**

### Property 7: Reactive UI Updates
*For any* mode change, all pizza cards should immediately update their price displays and badge visibility to reflect the new mode.
**Validates: Requirements 5.5**

### Property 8: Modal Content Display
*For any* pizza selected in single mode, the modal should display the pizza name, ingredients, all four sizes with prices, and include the notes field and action buttons.
**Validates: Requirements 4.1, 4.2, 4.5**

### Property 9: State Persistence
*For any* mode selection, the system should restore the previously selected mode when the page loads if the information is available in storage.
**Validates: Requirements 6.4**

### Property 10: Data Source Integrity
*For any* pizza data access, the system should use the existing especialidades2x1 array and preserve all pizza properties (name, ingredients, prices) without modification.
**Validates: Requirements 8.1, 8.2, 8.4**

## Error Handling

### Mode Selection Errors
- **Invalid Mode State**: If an invalid mode is somehow set, default to '2x1' mode
- **State Corruption**: If localStorage contains corrupted mode data, reset to default '2x1' mode
- **Component Mount Errors**: If mode selector fails to render, provide fallback UI with 2x1 mode active

### Pizza Data Errors
- **Missing Pizza Data**: If a pizza is missing required properties, skip rendering that card and log error
- **Price Data Corruption**: If price data is invalid, display "Price unavailable" message
- **Configuration Loading Errors**: If especialidades2x1 fails to load, display error message and retry mechanism

### Modal Interaction Errors
- **Modal State Errors**: If modal fails to open, provide fallback navigation to 2x1 page
- **Form Validation**: Validate notes field input length and sanitize for security
- **Focus Management**: Ensure proper focus handling when modal opens/closes for accessibility

### Navigation Errors
- **Route Navigation Failures**: If navigation to /2x1 fails, display error message and allow retry
- **localStorage Errors**: If localStorage is unavailable, continue with session-only state management
- **Browser Compatibility**: Provide graceful degradation for older browsers

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests** focus on:
- Specific examples and edge cases (empty pizza data, invalid modes)
- Component integration points (modal opening/closing, navigation triggers)
- Error conditions and boundary cases
- Accessibility compliance (keyboard navigation, screen reader support)

**Property-Based Tests** focus on:
- Universal properties that hold across all inputs (price formatting, mode consistency)
- Comprehensive input coverage through randomization (all pizzas, all modes)
- State management correctness across different interaction sequences
- UI consistency across different data combinations

### Property-Based Testing Configuration

**Testing Library**: React Testing Library with @fast-check/jest for property-based testing
**Minimum Iterations**: 100 iterations per property test to ensure thorough coverage
**Test Tagging**: Each property test must reference its design document property

**Tag Format**: `Feature: pizza-selection-modes, Property {number}: {property_text}`

**Example Property Test Structure**:
```typescript
// Feature: pizza-selection-modes, Property 2: Price Display Based on Mode
test('price display matches mode configuration', () => {
  fc.assert(fc.property(
    fc.constantFrom('2x1', 'single'),
    fc.integer({ min: 0, max: especialidades2x1.length - 1 }),
    (mode, pizzaIndex) => {
      const pizza = especialidades2x1[pizzaIndex]
      const displayedPrices = getPriceDisplay(pizza, mode)
      
      if (mode === '2x1') {
        expect(displayedPrices).toContain(`CH $${pizza.prices.CH}`)
        expect(displayedPrices).toContain(`MED $${pizza.prices.MED}`)
        expect(displayedPrices).not.toContain('GDE')
        expect(displayedPrices).not.toContain('FAM')
      } else {
        expect(displayedPrices).toContain(`CH $${pizza.prices.CH}`)
        expect(displayedPrices).toContain(`MED $${pizza.prices.MED}`)
        expect(displayedPrices).toContain(`GDE $${pizza.prices.GDE}`)
        expect(displayedPrices).toContain(`FAM $${pizza.prices.FAM}`)
      }
    }
  ))
})
```

### Unit Testing Balance

Unit tests complement property-based tests by focusing on:
- **Specific Examples**: Default mode initialization, specific pizza selection flows
- **Integration Testing**: Header/Footer compatibility, existing 2x1 page integration
- **Edge Cases**: Empty pizza arrays, network failures, localStorage unavailability
- **Accessibility**: Keyboard navigation, ARIA labels, focus management
- **Error Boundaries**: Component error handling, graceful degradation

Property-based tests handle comprehensive input coverage, while unit tests ensure specific scenarios and integration points work correctly. Together, they provide both broad coverage and targeted validation of critical functionality.