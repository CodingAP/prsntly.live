import 'dart:convert';

class PresentationState {
  PresentationState(
      {required this.pointers,
      required this.drawingSurfaces,
      required this.currentSlide,
      required this.count});
  final Map<String, Pointer?> pointers;
  final List<DrawableSurface> drawingSurfaces;
  final int currentSlide;
  final int count;

  factory PresentationState.fromJson(Map<String, dynamic> input) {
    final drawableData = input['drawingSurfaces'] as List<dynamic>;
    final pointerData = input['pointers'] as Map<String, dynamic>;
    pointerData.forEach((key, value) {
      if (value == null) {
        pointerData[key] = null;
      } else {
        pointerData[key] = Pointer.fromJson(value as Map<String, dynamic>);
      }
    });

    return PresentationState(
        pointers: pointerData as Map<String, Pointer?>,
        drawingSurfaces:
            drawableData.map((data) => DrawableSurface.fromJson(data)).toList(),
        currentSlide: input['currentSlide'],
        count: input['count']);
  }

  @override
  String toString() {
    String allDrawables = drawingSurfaces
        .map((drawableSurface) => drawableSurface.toString())
        .join(', ');
    String json = jsonEncode(pointers);
    return 'PresentationState: ($json, $allDrawables, $currentSlide, $count)';
  }
}

class DrawableSurface {
  DrawableSurface({required this.drawables, required this.current});
  final List<Drawable> drawables;
  final Map<String, Drawable?> current;

  factory DrawableSurface.fromJson(Map<String, dynamic> input) {
    final drawableData = input['drawables'] as List<dynamic>;
    return DrawableSurface(
        drawables: drawableData.map((data) => Drawable.fromJson(data)).toList(),
        current: input['current']);
  }

  @override
  String toString() {
    String allDrawables =
        drawables.map((drawable) => drawable.toString()).join(', ');
    String json = jsonEncode(current);
    return 'DrawableSurface: ($allDrawables, $json)';
  }
}

class Drawable {
  Drawable({required this.type, required this.uuid, required this.data});
  final String type;
  final String uuid;
  final Map<String, dynamic> data;

  factory Drawable.fromJson(Map<String, dynamic> input) {
    return Drawable(
        type: input['type'] as String,
        uuid: input['uuid'] as String,
        data: input['data'] as Map<String, dynamic>);
  }

  @override
  String toString() {
    String json = jsonEncode(data);
    return 'Drawable: ($type, $uuid, $json)';
  }
}

class Pointer {
  Pointer({required this.x, required this.y});
  final int x;
  final int y;

  factory Pointer.fromJson(Map<String, dynamic> input) {
    return Pointer(x: input['x'] as int, y: input['y'] as int);
  }

  @override
  String toString() {
    return 'Pointer: ($x, $y)';
  }
}
