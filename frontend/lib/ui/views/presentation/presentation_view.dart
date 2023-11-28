import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:stacked/stacked.dart';

import 'presentation_viewmodel.dart';

class PresentationView extends StackedView<PresentationViewModel> {
  const PresentationView({Key? key, required this.code}) : super(key: key);
  final String code;

  @override
  Widget builder(
    BuildContext context,
    PresentationViewModel viewModel,
    Widget? child,
  ) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      body: Center(child: Text('Code: $code')),
    );
  }

  @override
  PresentationViewModel viewModelBuilder(
    BuildContext context,
  ) =>
      PresentationViewModel();

  @override
  void onViewModelReady(PresentationViewModel viewModel) =>
      SchedulerBinding.instance
          .addPostFrameCallback((timeStamp) => viewModel.loadAllImages(code));
}
