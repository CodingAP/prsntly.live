import 'package:flutter/material.dart';
import 'package:stacked/stacked.dart';
import 'package:stacked/stacked_annotations.dart';

import 'join_presentation_viewmodel.dart';
import 'join_presentation_view.form.dart';

@FormView(fields: [
  FormTextField(name: 'code'),
])
class JoinPresentationView extends StackedView<JoinPresentationViewModel>
    with $JoinPresentationView {
  const JoinPresentationView({Key? key}) : super(key: key);

  @override
  Widget builder(
    BuildContext context,
    JoinPresentationViewModel viewModel,
    Widget? child,
  ) {
    return Scaffold(
      appBar: AppBar(title: const Text('Join Presentation')),
      body: Container(
        padding: const EdgeInsets.only(left: 25.0, right: 25.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextFormField(controller: codeController),
              ElevatedButton(
                onPressed: () => viewModel.tryToJoin(),
                child: const Text('Submit'),
              ),
              if (viewModel.isBusy)
                const SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(),
                ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void onViewModelReady(JoinPresentationViewModel viewModel) {
    syncFormWithViewModel(viewModel);
  }

  @override
  void onDispose(JoinPresentationViewModel viewModel) {
    super.onDispose(viewModel);
    disposeForm();
  }

  @override
  JoinPresentationViewModel viewModelBuilder(
    BuildContext context,
  ) =>
      JoinPresentationViewModel();
}
