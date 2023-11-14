import 'package:flutter/material.dart';

class PresentationPage extends StatefulWidget {
  const PresentationPage({Key? key, required this.code}) : super(key: key);
  final String code;

  @override
  State<PresentationPage> createState() => _PresentationPageState();
}

class _PresentationPageState extends State<PresentationPage> {
  @override
  Widget build(BuildContext context) {
    return Center(child: Text(widget.code));
  }
}

class PresentationState {
  final int currentSlide;
  final int count;

  const PresentationState({required this.currentSlide, required this.count});

  factory PresentationState.fromJson(Map<String, dynamic> json) {
    return PresentationState(
      currentSlide: json['currentSlide'] as int,
      count: json['count'] as int,
    );
  }
}
