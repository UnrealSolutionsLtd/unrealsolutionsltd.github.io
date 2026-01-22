# Cursor Prompt: AI Cinematic Director MVP

Create a minimal Unreal Engine 5.4+ plugin called "CinematicDirector" that lets users describe camera shots in natural language and automatically places cameras in the scene.

## Core MVP Features

### 1. Editor Window UI
- Simple text input field for shot description
- "Generate Camera" button
- Dropdown to select target actor (character to focus on)
- Status/feedback area

### 2. LLM Integration
- OpenAI API integration (GPT-4) with configurable API key in Project Settings
- System prompt that interprets shot descriptions and returns structured JSON:

```json
{
  "shot_type": "close_up|medium|wide|extreme_close_up|full_body",
  "angle": "eye_level|low_angle|high_angle|dutch|overhead",
  "position_offset": {"x": 0, "y": -200, "z": 50},
  "focal_length": 35,
  "focus_on_target": true,
  "dolly": false
}
```

### 3. Camera Placement Logic
- Calculate camera position relative to selected target actor
- Apply shot type rules (close_up = 100-150 units, medium = 200-400, wide = 500+)
- Apply angle adjustments (low_angle = -30 pitch, high_angle = +45, etc.)
- Set focal length on CineCamera
- Auto-focus on target actor

### 4. Output
- Spawn ACineCameraActor in the level
- Optionally create a LevelSequence with the camera track
- Select the new camera in editor

## File Structure

```
CinematicDirector/
├── CinematicDirector.uplugin
├── Source/
│   └── CinematicDirector/
│       ├── CinematicDirector.Build.cs
│       ├── Public/
│       │   ├── CinematicDirectorModule.h
│       │   ├── CinematicDirectorSubsystem.h
│       │   ├── ShotInterpreter.h
│       │   └── CameraPlacementUtils.h
│       └── Private/
│           ├── CinematicDirectorModule.cpp
│           ├── CinematicDirectorSubsystem.cpp
│           ├── ShotInterpreter.cpp
│           ├── CameraPlacementUtils.cpp
│           └── UI/
│               ├── SCinematicDirectorWindow.h
│               └── SCinematicDirectorWindow.cpp
```

## Technical Requirements

- Use Slate for editor UI (EditorUtilityWidget alternative acceptable)
- HTTP module for OpenAI API calls
- Json module for parsing responses
- CinematicCamera module dependency
- LevelSequence module for optional Sequencer integration
- Store API key in EditorPerProjectUserSettings

## Example Usage Flow

User types: "Dramatic low angle close-up of the character looking menacing"

LLM returns: shot_type=close_up, angle=low_angle, focal_length=85

Plugin calculates position 120 units from target, 40 units below eye level

Spawns CineCameraActor, points at target, sets 85mm lens

Camera appears in viewport, selected and ready

## Phase 2 (post-MVP, don't implement yet)
- Multiple camera suggestions
- Sequencer shot assembly
- Audio beat detection
- Camera movement/animation
- Style presets (action, dramatic, horror)

## Implementation Order

1. Start with plugin boilerplate and editor window
2. Implement OpenAI API integration
3. Build camera placement logic
4. Connect UI to placement system
5. Add Sequencer integration (optional)
