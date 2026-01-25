# Implementation Plan: Pizza Selection Modes

## Overview

This implementation plan converts the dual-mode pizza selection design into discrete coding tasks. The approach focuses on incremental development, starting with core mode selection functionality, then enhancing the existing pizza cards, adding modal functionality, and finally integrating everything with comprehensive testing.

## Tasks

- [ ] 1. Set up mode selection infrastructure
  - [ ] 1.1 Create TypeScript interfaces and types for selection modes
    - Define SelectionMode type ('2x1' | 'single')
    - Create PizzaSelectionState interface
    - Define MODE_CONFIG constant with mode configurations
    - _Requirements: 1.1, 1.5_

  - [ ] 1.2 Implement ModeSelector component
    - Create toggle button interface for mode selection
    - Add active state styling and visual feedback
    - Integrate with existing header design patterns
    - Implement accessibility features (ARIA labels, keyboard navigation)
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ]* 1.3 Write property test for mode selection state management
    - **Property 1: Mode Selection State Management**
    - **Validates: Requirements 1.2, 1.3, 1.4**

- [ ] 2. Enhance PizzaCard component for dual-mode display
  - [ ] 2.1 Modify PizzaCard to accept mode prop and display appropriate pricing
    - Update PizzaCard interface to include mode parameter
    - Implement conditional price display logic (CH/MED for 2x1, all sizes for single)
    - Maintain existing responsive design and animations
    - _Requirements: 2.1, 3.1, 5.2, 5.3_

  - [ ] 2.2 Implement conditional promotional badge display
    - Add 2x1 badge component with conditional rendering
    - Ensure badge only appears in 2x1 mode
    - Style badge to match existing design system
    - _Requirements: 2.2, 3.2_

  - [ ] 2.3 Create price formatting utility functions
    - Implement consistent price formatting with currency symbols
    - Create mode-specific price display formatters
    - Ensure proper spacing and typography
    - _Requirements: 5.4, 2.5, 3.3_

  - [ ]* 2.4 Write property tests for price display and badge functionality
    - **Property 2: Price Display Based on Mode**
    - **Property 3: Promotional Badge Conditional Display**
    - **Property 6: Price Formatting Consistency**
    - **Validates: Requirements 2.1, 2.2, 3.1, 3.2, 5.2, 5.3, 5.4**

- [ ] 3. Implement PizzaModal component for single pizza mode
  - [ ] 3.1 Create PizzaModal component using shadcn/ui Dialog
    - Set up Dialog component with proper accessibility
    - Implement modal state management (open/close)
    - Add focus management and keyboard navigation
    - _Requirements: 4.4_

  - [ ] 3.2 Build modal content display for pizza details
    - Display pizza name, ingredients, and all size options
    - Format information according to requirements specification
    - Implement responsive design for different screen sizes
    - _Requirements: 4.1, 4.2, 4.5_

  - [ ] 3.3 Add notes field and action buttons to modal
    - Create textarea component for customization notes
    - Add close and proceed action buttons
    - Implement form validation for notes field
    - _Requirements: 4.3, 4.4_

  - [ ]* 3.4 Write property test for modal content display
    - **Property 8: Modal Content Display**
    - **Validates: Requirements 4.1, 4.2, 4.5**

- [ ] 4. Checkpoint - Ensure core components work independently
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Integrate mode-based navigation and state management
  - [ ] 5.1 Enhance PizzasPage component with mode state management
    - Add useState hook for mode selection state
    - Implement mode change handlers
    - Add state persistence using localStorage
    - _Requirements: 1.5, 6.4_

  - [ ] 5.2 Implement mode-based pizza selection handlers
    - Create handlePizzaSelection function with mode-specific logic
    - Implement 2x1 mode navigation to /2x1 page
    - Implement single mode modal opening
    - Maintain backward compatibility with existing 2x1 flow
    - _Requirements: 2.3, 3.4, 6.1, 6.2_

  - [ ] 5.3 Add localStorage integration for selection data
    - Store selected pizza name for 2x1 mode
    - Include mode information in stored data
    - Maintain compatibility with existing localStorage usage
    - Handle localStorage errors gracefully
    - _Requirements: 2.4, 6.3, 8.3_

  - [ ]* 5.4 Write property tests for navigation and state management
    - **Property 4: Mode-Based Navigation Behavior**
    - **Property 5: Data Storage Consistency**
    - **Property 9: State Persistence**
    - **Validates: Requirements 2.3, 2.4, 3.4, 6.1, 6.2, 6.3, 6.4**

- [ ] 6. Implement reactive UI updates and data integration
  - [ ] 6.1 Add reactive price display updates on mode changes
    - Implement immediate UI updates when mode changes
    - Ensure all pizza cards update simultaneously
    - Maintain smooth transitions and animations
    - _Requirements: 5.5_

  - [ ] 6.2 Ensure data source integrity and compatibility
    - Verify usage of existing especialidades2x1 array
    - Maintain all existing pizza properties
    - Preserve existing price structure access
    - Test integration with existing Header and Footer components
    - _Requirements: 8.1, 8.2, 8.4_

  - [ ]* 6.3 Write property tests for reactive updates and data integrity
    - **Property 7: Reactive UI Updates**
    - **Property 10: Data Source Integrity**
    - **Validates: Requirements 5.5, 8.1, 8.2, 8.4**

- [ ] 7. Wire all components together in PizzasPage
  - [ ] 7.1 Integrate ModeSelector with PizzasPage state management
    - Connect mode selector to page-level state
    - Ensure proper event handling and state updates
    - Test mode switching functionality end-to-end
    - _Requirements: 1.2, 1.3, 1.4_

  - [ ] 7.2 Connect enhanced PizzaCard components to mode state
    - Pass mode prop to all PizzaCard instances
    - Ensure proper re-rendering on mode changes
    - Maintain existing grid layout and responsiveness
    - _Requirements: 2.1, 3.1, 7.1_

  - [ ] 7.3 Integrate PizzaModal with pizza selection flow
    - Connect modal to single mode pizza selection
    - Implement modal state management in parent component
    - Ensure proper cleanup and state reset
    - _Requirements: 3.4, 4.1, 4.2_

  - [ ]* 7.4 Write integration tests for complete workflow
    - Test complete 2x1 mode selection and navigation flow
    - Test complete single mode selection and modal flow
    - Test mode switching with various pizza selections
    - _Requirements: 2.3, 3.4, 6.1, 6.2_

- [ ] 8. Add error handling and edge case management
  - [ ] 8.1 Implement error boundaries and fallback UI
    - Add error handling for component mount failures
    - Implement fallback UI for mode selector errors
    - Handle pizza data loading errors gracefully
    - _Requirements: 1.5, 8.1_

  - [ ] 8.2 Add form validation and input sanitization
    - Validate notes field input length and content
    - Sanitize user input for security
    - Handle localStorage availability issues
    - _Requirements: 4.3, 6.3_

  - [ ]* 8.3 Write unit tests for error conditions
    - Test invalid mode state handling
    - Test missing pizza data scenarios
    - Test localStorage unavailability
    - Test modal interaction errors

- [ ] 9. Final checkpoint and compatibility verification
  - [ ] 9.1 Verify backward compatibility with existing 2x1 page
    - Test that existing /2x1 page continues to work
    - Verify localStorage data format compatibility
    - Ensure Header and Footer components remain functional
    - _Requirements: 6.5, 8.5_

  - [ ] 9.2 Perform accessibility and responsive design testing
    - Test keyboard navigation across all components
    - Verify screen reader compatibility
    - Test responsive behavior on different screen sizes
    - Validate ARIA labels and focus management
    - _Requirements: 7.2, 7.4_

  - [ ]* 9.3 Write comprehensive end-to-end tests
    - Test complete user workflows for both modes
    - Test cross-browser compatibility
    - Test performance with large pizza datasets
    - Validate accessibility compliance

- [ ] 10. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout development
- Property tests validate universal correctness properties from the design
- Unit tests validate specific examples, edge cases, and integration points
- The implementation maintains full backward compatibility with existing 2x1 functionality