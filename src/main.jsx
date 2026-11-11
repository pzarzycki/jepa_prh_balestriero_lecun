import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import './style.css';

const JEPA = 'https://arxiv.org/pdf/2610.39302v1';
const FER = 'https://arxiv.org/pdf/2505.11581v2';
const PRH = 'https://arxiv.org/pdf/2405.07987v5';
const ROSETTA = 'https://arxiv.org/pdf/2610.09411v2';
const IJEPA = 'https://arxiv.org/pdf/2301.08243';
const tex = String.raw;

function MathText({children, block = false}) {
  const html = katex.renderToString(children, {displayMode: block, throwOnError: true});
  return <span className={block ? 'equation' : 'inline-math'} dangerouslySetInnerHTML={{__html: html}} />;
}

const figures = {
  world: ['huh-world', 'A world Z, shown as a red sphere beside a blue cone, gives rise to an image X and a text description Y. Each modality has its own encoder.', 'Huh et al. · Figure 1', PRH + '#page=1'],
  alignment: ['huh-alignment', 'On Wikipedia image–caption pairs, nearest-neighbor overlap with DINOv2 generally rises with language-model performance. Smaller panels compare MAE, ImageNet, and CLIP vision encoders.', 'Huh et al. · Figure 3', PRH + '#page=4'],
  ijepa: ['ijepa-architecture', 'I-JEPA encodes visible image patches, predicts the embeddings of three color-coded target regions using their locations, and compares each prediction with the corresponding target encoder output.', 'Assran et al. · I-JEPA, Figure 3', IJEPA + '#page=3'],
  overview: ['jepa-overview', 'The same scene supplies two photos to an image JEPA and two captions to a text JEPA. The two learned spaces are compared across modalities. At right, alignment is plotted against training draws.', 'Balestriero & LeCun · Figure 1', JEPA + '#page=1'],
  pairs: ['jepa-pairs', 'Four positive-pair graphs compare good views, weak corruptions, strong corruptions, and next-token prediction.', 'Balestriero & LeCun · Figure 3', JEPA + '#page=6'],
  scale: ['jepa-scale', 'Mutual 10-nearest-neighbor overlap and Flickr retrieval across training scales and reference encoders.', 'Balestriero & LeCun · Figure 9', JEPA + '#page=10'],
  caption: ['jepa-caption', 'Four COCO images with generated and reference captions.', 'Balestriero & LeCun · Figure 10', JEPA + '#page=11'],
  law: ['jepa-law', 'Observed retrieval scores versus scaling-law predictions across training sample counts and good-view fractions.', 'Balestriero & LeCun · Figure 11', JEPA + '#page=12'],
  rosetta: ['rosetta-geometry', 'Schnaus et al. illustrate alignment of disjoint image and caption embedding sets from DINOv2 and Qwen3-8B. Example images and nearest text neighbors share coarse semantics.', 'Schnaus et al. · Figure 1', ROSETTA + '#page=2'],
  sweeps: ['fer-sweeps', 'Weight sweeps for the evolved skull and direct gradient fit. Evolved sweeps vary features like the mouth and jaw.', 'Kumar et al. · Figure 6', FER + '#page=11'],
};

function Figure({id, zoom, className = ''}) {
  const [file, alt, label, url] = figures[id];
  return <figure className={'paper-figure ' + className}>
    <button className="image-button" onClick={() => zoom(id)} aria-label={'Enlarge ' + label}>
      <img src={import.meta.env.BASE_URL + 'figures/' + file + '.webp'} alt={alt} />
      <span className="enlarge" aria-hidden="true">⤢</span>
    </button>
    <figcaption><a href={url} target="_blank" rel="noreferrer">{label} <ExternalIcon/></a></figcaption>
  </figure>;
}
function ExternalIcon() {
  return <svg aria-hidden="true" width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M3 9L9 3M5 3h4v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function Point({title, children}) {
  return <section className="point"><h2>{title}</h2><p>{children}</p></section>;
}
function Source({href, children}) {
  return <a className="source" href={href} target="_blank" rel="noreferrer">{children} <ExternalIcon/></a>;
}
function Table({columns, rows}) {
  return <div className="table-wrap"><table><thead><tr>{columns.map(x => <th key={x} scope="col">{x}</th>)}</tr></thead>
    <tbody>{rows.map(([label, ...values]) => <tr key={label}><th scope="row">{label}</th>{values.map((v, j) => <td key={j}>{v}</td>)}</tr>)}</tbody>
  </table></div>;
}

const slides = [
  {hash:'slide-1', topic:'Abstract', title:'Proving and improving the PRH',
    lead:'The Platonic Representation Hypothesis (PRH) conjectures that as models scale, models trained on different modalities converge toward a shared representation of the world.',
    body: ({zoom}) => <><Figure id="overview" zoom={zoom} className="overview"/>
      <div className="theory-grid">
        <Point title="What the theorem explains">A Joint-Embedding Predictive Architecture (JEPA) trains on positives within its own modality. A shared pair law and a unique optimum up to rotation give both encoders the same geometry.</Point>
        <Point title="What the experiments test">Scene-grouped views nearly match next-token prediction’s cross-modal alignment on WIT-1024 with 42× fewer sample draws. The authors also fit a scaling law for alignment.</Point>
        <Point title="What the geometry enables">Fit one map to connect independently trained encoders for captioning, or infer a map from two disjoint embedding pools without matched image–caption examples.</Point>
      </div><Source href={JEPA + '#page=1'}>Randall Balestriero and Yann LeCun · Abstract</Source>
    </>},
  {hash:'slide-2', topic:'Original hypothesis', title:'Do vision and language models agree?',
    lead:'Take a photo and its caption. Do their ten nearest neighbors point to the same Wikipedia examples?',
    body: ({zoom}) => <div className="split origins">
      <div><p className="byline"><strong>Minyoung Huh, Brian Cheung, Tongzhou Wang, and Phillip Isola</strong><br/>ICML 2024</p>
        <Point title="The test">Encode 1,024 Wikipedia image–caption pairs with existing models. Find each item’s ten nearest neighbors in each space, then count the overlap. The pairs match items for evaluation.</Point>
        <Point title="The result">Better language models generally agreed more with vision models. In the DINOv2 comparison, overlap reached about <strong>0.16 out of 1.0</strong>. In a separate test of 78 vision models, better transfer performance also went with greater agreement.</Point>
        <Point title="The hypothesis">Images and captions reveal different aspects of one world. Huh et al. conjectured that greater model capacity and more diverse data and tasks could drive models toward a shared statistical representation of that world.</Point>
        <p className="note">When does greater agreement become a guarantee of shared geometry?</p>
        <Source href="https://proceedings.mlr.press/v235/huh24a.html">Original PRH position paper</Source>
      </div><div className="origin-figures">
        <Figure id="alignment" zoom={zoom}/>
        <Figure id="world" zoom={zoom} className="world"/>
      </div>
    </div>},
  {hash:'jepa', topic:'Architecture background', title:'What is a JEPA?',
    lead:'A Joint-Embedding Predictive Architecture learns to predict the representation of a target from a related context.',
    body: ({zoom}) => <div className="split">
      <div>
        <Point title="Encode what you can see">In I-JEPA, the context encoder reads the visible patches of an image. A target encoder provides the embeddings of the colored target regions.</Point>
        <Point title="Predict a vector for each target">The predictor gets the context embedding and the target location. Its output is compared with the target encoder’s vector for that region. The training target lives in embedding space.</Point>
        <Point title="How the PRH paper uses JEPA">Its experiments use LeJEPA. They compare related view embeddings directly, with no learned predictor between them. SIGReg keeps the embeddings from collapsing to a single vector.</Point>
        <Source href="https://openreview.net/pdf/315d43ba26f55357a84cec9a7ed15a6610094f79.pdf">LeCun’s original proposal (2022)</Source>{' · '}<Source href="https://arxiv.org/abs/2511.08544">LeJEPA (2025)</Source>
      </div><Figure id="ijepa" zoom={zoom} className="ijepa-figure"/>
    </div>},
  {hash:'slide-3', topic:'Section 2.1', title:'The world, the objective, the theorem',
    lead:'The formal question is when independently trained encoders recover one world embedding up to an orthogonal change of coordinates.',
    body: () => <><div className="theory-grid">
      <section className="point notation"><h2>1. Define the world and the data</h2>
        <dl>
          <dt><MathText>{tex`z,z'\in\mathcal Z`}</MathText></dt><dd>States in a finite world <MathText>{tex`\mathcal Z`}</MathText>. A state can be a scene, such as a red sphere beside a blue cone.</dd>
          <dt><MathText>{tex`p(z)>0`}</MathText></dt><dd>Probability of state <MathText>z</MathText>.</dd>
          <dt><MathText>{tex`m=1,\ldots,M`}</MathText></dt><dd>Modality index. <MathText>{tex`M\ge2`}</MathText>, for example image and text.</dd>
          <dt><MathText>{tex`x=g_m(z)`}</MathText></dt><dd>Rendering into observation space <MathText>{tex`\mathcal X_m`}</MathText>. Injective means different states have distinct observations within this idealization.</dd>
          <dt><MathText>{tex`\pi_m(z,z')`}</MathText></dt><dd>Joint probability of sampling states as a positive pair. Swapping endpoints leaves it unchanged. Either endpoint alone has distribution <MathText>p</MathText>.</dd>
        </dl>
      </section>
      <section className="point notation"><h2>2. Define the learning problem</h2>
        <dl>
          <dt><MathText>{tex`(g_m(z),g_m(z'))`}</MathText></dt><dd>The two inputs to one modality’s training loss.</dd>
          <dt><MathText>{tex`f:\mathcal X_m\to\mathbb R^k`}</MathText></dt><dd>Encoder into <MathText>k</MathText> embedding dimensions.</dd>
          <dt><MathText>{tex`\ell(a,b)`}</MathText></dt><dd>Prediction cost comparing embedding vectors <MathText>a</MathText> and <MathText>b</MathText> directly. This is the identity predictor.</dd>
          <dt><MathText>{tex`\Omega(f)`}</MathText></dt><dd>Anti-collapse term on the embedding distribution. Both terms are invariant under a common orthogonal transform.</dd>
          <dt><MathText>{tex`h_m=f_m\circ g_m`}</MathText></dt><dd>Same encoder written as a function of the world state. It lets both losses be expressed on <MathText>{tex`\mathcal Z`}</MathText>.</dd>
        </dl>
      </section>
      <section className="point theorem"><h2>Theorem 1 · Platonic representation</h2>
        <p>If all modalities share one <MathText>{tex`\pi`}</MathText> and the resulting world objective has a unique population optimum up to orthogonal transformation, then</p>
        <MathText block>{tex`f_m^\star\circ g_m=Q_m h^\star,\qquad Q_m\in O(k).`}</MathText>
        <p><MathText>{tex`h^\star`}</MathText> is a common optimal world embedding. <MathText>{tex`f_m^\star`}</MathText> minimizes the modality loss. <MathText>{tex`O(k)`}</MathText> is the set of distance-preserving linear maps, including reflections. One <MathText>{tex`Q_m`}</MathText> works for every state.</p>
        <p className="theorem-note"><strong>Why it follows.</strong> With unrestricted encoders and injective renderings, each modality can realize any world embedding. They solve the same objective, so only the choice of orthogonal coordinates remains.</p>
      </section>
    </div><div className="math-panel compact"><MathText block>{tex`\mathcal L_m(f)=\mathbb E_{(z,z')\sim\pi_m}\!\left[\ell\!\left(f(g_m(z)),f(g_m(z'))\right)\right]+\Omega(f)`}</MathText></div>
    <Source href={JEPA + '#page=3'}>Section 2.1 · Equation 1 and Theorem 1</Source></>},
  {hash:'proposition-1', topic:'Proposition 1 · Section 2.1', title:'From eigenvectors to scene embeddings',
    lead:'Each eigenvector assigns one number to every state. Read the same state’s entry from k eigenvectors to construct its k-dimensional embedding.',
    body: () => <><div className="theory-grid">
      <section className="point theorem"><h2>1. A matrix indexed by states</h2>
        <p>With 1,000 world states, the normalized pair graph is a <MathText>{tex`1000\times1000`}</MathText> matrix. Rows and columns both identify states.</p>
        <MathText block>{tex`(K_\pi)_{zz'}=\frac{\pi(z,z')}{\sqrt{p(z)p(z')}}`}</MathText>
        <p>The numerator is the joint probability of drawing the two states as a positive pair.</p>
      </section>
      <section className="point theorem"><h2>2. An eigenvector has 1,000 entries</h2>
        <MathText block>{tex`K_\pi v_i=\mu_i v_i,\qquad v_i\in\mathbb R^{1000}`}</MathText>
        <p><MathText>{tex`v_i(z)`}</MathText> is a single number: eigenvector <MathText>i</MathText>’s entry for state <MathText>z</MathText>. <MathText>{tex`\mu_i`}</MathText>, pronounced “mu,” is its eigenvalue.</p>
        <p>One eigenvector supplies one coordinate across all states. Its length is the number of states, even if the final embedding has only three dimensions.</p>
      </section>
      <section className="point theorem"><h2>3. One state gets k coordinates</h2>
        <MathText block>{tex`\Phi_\pi(z)=\frac{(v_1(z),\ldots,v_k(z))^\top}{\sqrt{p(z)}}`}</MathText>
        <p>Use the top <MathText>k</MathText> nonconstant eigenvectors and scale each state’s row by <MathText>{tex`1/\sqrt{p(z)}`}</MathText>. The resulting coordinates satisfy the whitening constraint.</p>
        <p>For three dimensions, read three entries from the same row:</p>
      </section>
    </div>
    <Table columns={['State', 'Eigenvector 1', 'Eigenvector 2', 'Eigenvector 3', 'Embedding']} rows={[
      ['State 1', <MathText>{tex`v_1(1)`}</MathText>, <MathText>{tex`v_2(1)`}</MathText>, <MathText>{tex`v_3(1)`}</MathText>, <MathText>{tex`\Phi_\pi(1)`}</MathText>],
      ['State 42', <MathText>{tex`v_1(42)`}</MathText>, <MathText>{tex`v_2(42)`}</MathText>, <MathText>{tex`v_3(42)`}</MathText>, <MathText>{tex`\frac{(v_1(42),v_2(42),v_3(42))^\top}{\sqrt{p(42)}}`}</MathText>],
      ['State 1,000', <MathText>{tex`v_1(1000)`}</MathText>, <MathText>{tex`v_2(1000)`}</MathText>, <MathText>{tex`v_3(1000)`}</MathText>, <MathText>{tex`\Phi_\pi(1000)`}</MathText>],
    ]}/>
    <p className="note"><strong>Proposition 1.</strong> For squared-distance loss with whitening, a gap <MathText>{tex`\mu_k>\mu_{k+1}`}</MathText> makes every population optimum a rotation or reflection of this embedding. Training can reach it by minimizing the loss. In feature-covariance PCA, eigenvectors instead have one entry per original feature.</p>
    <Source href={JEPA + '#page=3'}>Proposition 1 · Spectral JEPAs Are Unique Up to Rotation</Source></>},
  {hash:'slide-4', topic:'Proposition 1 · Theorem 2 · Proposition 2', title:'Shared geometry and how to align it',
    lead:'The pair graph determines the geometry. Graph disagreement limits alignment. Matched examples reveal the rotation between two otherwise compatible spaces.',
    body: () => <><div className="theory-grid">
      <section className="point theorem"><h2>Proposition 1 · Which geometry is learned?</h2>
        <p><strong>Normalize the graph.</strong> The pair probabilities <MathText>{tex`\Pi_{zz'}=\pi(z,z')`}</MathText> and state frequencies <MathText>{tex`D=\operatorname{diag}(p)`}</MathText> give <MathText>{tex`K_\pi=D^{-1/2}\Pi D^{-1/2}`}</MathText>.</p>
        <p><strong>Whiten the embeddings.</strong> Coordinates have zero mean, unit variance, and zero covariance. This constrains the learned vectors.</p>
        <p>The squared-distance loss selects the top <MathText>k</MathText> nonconstant eigenvectors, scaled by <MathText>{tex`1/\sqrt{p(z)}`}</MathText>. A gap <MathText>{tex`\delta=\mu_k-\mu_{k+1}>0`}</MathText> fixes the subspace. Its axes can rotate or reflect.</p>
      </section>
      <section className="point theorem"><h2>Theorem 2 · Kernel mismatch bounds misalignment</h2>
        <p>For spectral embeddings with the same state frequencies, define the remaining root-mean-square error after the best rotation:</p>
        <MathText block>{tex`E_\Phi=\min_{Q\in O(k)}\left(\mathbb E_p\|\Phi_1(z)-Q\Phi_2(z)\|^2\right)^{1/2}`}</MathText>
        <MathText block>{tex`\begin{gathered}E_\Phi\leq\frac{2\sqrt{2}}{\delta}\min\!\left(\sqrt{k}\|\Delta K\|_2,\|\Delta K\|_F\right),\\ \Delta K=K_{\pi_1}-K_{\pi_2},\quad\delta=\mu_k-\mu_{k+1}>0.\end{gathered}`}</MathText>
        <p><strong>An upper bound.</strong> Graph disagreement sets a ceiling on alignment error, scaled by the inverse eigengap. A larger gap tightens the bound. Near a tie, small graph changes can select different subspaces.</p>
        <p><MathText>k</MathText> is the embedding dimension. <MathText>{tex`\|\cdot\|_2`}</MathText> is the operator norm, the largest stretching factor. <MathText>{tex`\|\cdot\|_F`}</MathText> is the square root of the sum of squared matrix entries. The gap is that of <MathText>{tex`K_{\pi_2}`}</MathText>.</p>
      </section>
      <section className="point theorem"><h2>Proposition 2 · How do we find the rotation?</h2>
        <p>A rotation preserves zero mean and identity covariance. Comparing those two statistics of unpaired embeddings cannot reveal their relative orientation.</p>
        <MathText block>{tex`\min_{Q\in O(k)}\sum_i\|a_i-Qb_i\|^2`}</MathText>
        <p>Here <MathText>{tex`a_i,b_i`}</MathText> encode the same state in different modalities. Fit one rotation or reflection to bring these matched vectors together. This is orthogonal Procrustes.</p>
        <p><strong>Exact guarantee.</strong> When the geometries agree exactly, <MathText>k</MathText> matched pairs whose vectors span the space uniquely determine the map. In 2D, two independent vectors suffice.</p>
      </section>
    </div>
    <p className="note">Proposition 2 uses cross-modal correspondences after training. Positive pairs used to train each encoder can stay within its own modality. Higher-order structure can sometimes reveal orientation without correspondences.</p>
    <Source href={JEPA + '#page=3'}>Proposition 1 · §2.1</Source>{' · '}<Source href={JEPA + '#page=4'}>Theorem 2 and Proposition 2 · §2.2</Source></>},
  {hash:'views-and-nuisance', topic:'Theorem 3 · Proposition 3 · Theorem 4', title:'What views preserve, and why it matters',
    lead:'An observation contains shared scene information and private details. View construction and the available data determine which of these survive in the learned geometry.',
    body: ({zoom}) => <><div className="theory-grid">
      <section className="point theorem"><h2>Theorem 3 · Nuisance costs alignment</h2>
        <p>Write <MathText>{tex`x=g_m(z,\nu)`}</MathText>, with shared state <MathText>z</MathText> and private nuisance <MathText>{tex`\nu`}</MathText>. For centered, whitened encoders of paired observations with independent nuisances:</p>
        <MathText block>{tex`\begin{gathered}\min_{Q\in O(k)}\mathbb E\|Qf_1(x_1)-f_2(x_2)\|^2\\ \geq 2k\left(1-\min_m\rho(f_m)\right).\end{gathered}`}</MathText>
        <MathText block>{tex`\rho(f)=\frac{\operatorname{tr}(C_f^{1/2})}{k},\quad C_f=\operatorname{Cov}(\mathbb E[f(x)\mid z])`}</MathText>
        <p><strong>A lower bound.</strong> The smaller scene-explained fraction <MathText>{tex`\rho\in[0,1]`}</MathText> sets an unavoidable floor on expected squared error. <MathText>{tex`\rho=1`}</MathText> exactly when the embedding depends only on the state. Zero floor alone does not guarantee alignment.</p>
        <p><strong>Nuisance can be useful.</strong> Viewpoint matters for navigation. The cost here concerns alignment with another modality that cannot match that private detail.</p>
      </section>
      <section className="point theorem"><h2>Proposition 3 · Which views keep nuisance?</h2>
        <p><strong>Good views.</strong> Independently sampled observations of related states vary their private details. With the required spectral separation, the optimum depends only on the state.</p>
        <p><strong>Bad views.</strong> Two corruptions of one observation can preserve wording, viewpoint, or lighting. Nuisance enters the embedding when its strongest retained correlation exceeds that of the last retained state direction.</p>
        <p>If <MathText>r</MathText> whitened dimensions encode pure private nuisance, expected squared alignment error is at least <MathText>2r</MathText>, under the independence assumptions.</p>
      </section>
      <section className="point theorem"><h2>Theorem 4 · Views and data set the graph</h2>
        <p>The view sampler and available observations jointly determine which world states get connected. Even the same masking rule can induce different graphs on different datasets.</p>
        <MathText block>{tex`|E_{\rm align}-d|\leq\tau_1+\tau_2`}</MathText>
        <p><MathText>d</MathText> is the distance between the induced graphs’ spectral embeddings after the best rotation. <MathText>{tex`E_{\rm align}`}</MathText> is the encoders’ root-mean-square alignment error.</p>
        <p>Under spectral separation, corrections <MathText>{tex`\tau_m`}</MathText> account for mixing state with nuisance. Good views give the intended state kernel and <MathText>{tex`\tau_m=0`}</MathText>.</p>
      </section>
    </div><Figure id="pairs" zoom={zoom} className="theory-figure"/>
    <Source href={JEPA + '#page=4'}>Theorem 3 and Proposition 3 · §2.3</Source>{' · '}<Source href={JEPA + '#page=5'}>Theorem 4 · Views and Data Set the World Kernel</Source></>},
  {hash:'slide-5', topic:'Proposition 4 · Section 2.4', title:'Next-token prediction as a JEPA', lead:'A language model learns which tokens fit a prefix. What does that tell it about the geometry of scenes?',
    body: () => <>
      <div className="theory-grid">
        <Point title="Find the positive pair">The prefix <MathText>c</MathText> and its actual next token <MathText>y</MathText> form the pair. The softmax compares the prefix embedding <MathText>{tex`h(c)`}</MathText> with the target token vector <MathText>{tex`w_y`}</MathText> and the rest of the vocabulary.</Point>
        <Point title="Why the link can be weak">“The dog is” and “The engine is” can both predict “running.” The authors argue that shared next tokens can indirectly link descriptions as data grows, but can also connect unrelated scenes. Good views link descriptions of the same scene directly.</Point>
        <Point title="What the loss leaves undetermined">An invertible change of basis can preserve every logit while changing distances between prefix embeddings. The spectral theorem has different assumptions. Weaker alignment with vision is a prediction the authors test in Section 3.</Point>
      </div>
      <div className="math-panel"><MathText block>{tex`-\log p_\theta(y\mid c)=-\langle h(c),w_y\rangle+\log\sum_v e^{\langle h(c),w_v\rangle}`}</MathText><p>The first term rewards the observed pair. The log-partition normalizes over vocabulary tokens.</p></div>
      <div className="math-panel compact"><MathText block>{tex`h\mapsto Gh,\qquad w_v\mapsto G^{-T}w_v`}</MathText><p>The two changes cancel in every prefix–token dot product.</p></div><Source href={JEPA + '#page=6'}>Section 2.4 · Next-token formulation</Source>
    </>},
  {hash:'slide-6', topic:'Sections 3–4', title:'Better pairs, stronger alignment', lead:'The two Flickr JEPAs share the caption data, text backbone, LeJEPA loss, trimming, and masking. The source of the views is the variable.',
    body: ({zoom}) => <><div className="theory-grid">
      <Point title="Good-view JEPA">Take a contiguous span from each of two captions of the same image. Mask 15% of tokens in each span and bring their embeddings closer.</Point>
      <Point title="Masked-span JEPA · the control">Draw the spans from one caption and apply the same trimming and masking. The loss still brings the span embeddings closer.</Point>
      <Point title="Next-token prediction">Train a causal version of the same text backbone with next-token softmax. This baseline changes the loss as well as how the views are paired.</Point>
    </div><Table columns={['Mutual 10-NN', 'Good-view JEPA', 'Masked-span JEPA', 'Next-token prediction']} rows={[
      ['Flickr30k · 33M text encoder', '0.062', '0.047', '0.042'],
      ['WIT-1024 · 109M at web scale', '0.184', '0.088', '0.111'],
    ]}/>
    <Figure id="scale" zoom={zoom} className="wide-figure experiment-figure"/>
    <div className="theory-grid">
      <Point title="Change views on both sides">Flickr’s image JEPA uses crops of one photo. On MSR-VTT, pairing different frames and different captions of a clip raises overlap to 0.067 versus 0.039.</Point>
      <Point title="Measure agreement without a map">Mutual 10-NN measures the fraction of neighbors shared by the two spaces. On WIT-1024, the 109M JEPA scores 0.184 with DINOv2-B versus 0.154 for Qwen2.5-72B.</Point>
      <Point title="What the 42× counts">WIT scores of 0.109 after 21.6M good-view draws and 0.111 after 900M next-token draws. That is 14× fewer text tokens, with different batches and corpus coverage.</Point>
    </div>
    <Source href={JEPA + '#page=7'}>Flickr and web-scale protocols</Source></>},
  {hash:'slide-7', topic:'Section 5.1', title:'Connecting independent encoders', lead:'A map into text-embedding space lets a separately trained decoder read visual features.',
    body: ({zoom}) => <><div className="flow" aria-label="Image to caption pipeline"><span>Image encoder</span><b aria-hidden="true">→</b><span>Fitted map</span><b aria-hidden="true">→</b><span>Text decoder</span></div>
      <Figure id="caption" zoom={zoom} className="wide-figure"/>
      <div className="split">
        <Point title="Train a decoder in text space">A frozen text JEPA encodes captions. The decoder learns to reconstruct text from these embeddings. Gaussian noise during training makes it more tolerant of errors in mapped image embeddings.</Point>
        <Point title="Fit just the map on paired data">The strongest configuration maps frozen DINOv2 and DINOv3 features into text space. Fit the map with orthonormal rows on about 30,000 Flickr pairs. The captioner reaches <strong>0.838 CIDEr</strong> on COCO.</Point>
      </div><p className="note"><strong>Proposition 2 · Identify the rotation.</strong> With exact shared k-dimensional geometry, k paired embeddings spanning the space determine the orthogonal map. The captioner uses many more pairs and unequal embedding widths, beyond that idealized guarantee.</p><Source href={JEPA + '#page=4'}>Proposition 2 · k Pairs Identify the Rotation</Source>{' · '}<Source href={JEPA + '#page=13'}>Section 5.1 · Captioning</Source>
    </>},
  {hash:'slide-8', topic:'Section 5.2 · Related work', title:'Shared geometry as a Rosetta Stone',
    lead:'Schnaus et al. recover a map between existing encoders. Balestriero and LeCun ask which training views make that map easier to recover.',
    body: ({zoom}) => <div className="split rosetta">
      <div><Figure id="rosetta" zoom={zoom}/>
        <Point title="What supplies the signal?">The mean and covariance of whitened embeddings are unchanged by rotation. The arrangement of clusters can distinguish orientations when the two clouds share sufficiently distinctive structure.</Point>
        <Source href={ROSETTA + '#page=4'}>Schnaus, Dagès, Cremers, Wang, and Isola · §3</Source>
      </div>
      <div>
        <Point title="How GeoWarP recovers the map">Cluster each cloud independently and match the clusters by their internal similarities. Use those matches to initialize Wasserstein Procrustes, alternating tentative point correspondences with updates to one map.</Point>
        <Point title="How the JEPA paper uses it">Keep their method fixed. Fit with DINOv2-B images from one half of COCO train2014 and caption embeddings from the other. The JEPA still learns from image-grouped captions upstream.</Point>
        <Table columns={['Text encoder', 'FOSCTTM ↓', 'ImageNet-100 top-5']} rows={[
          ['109M good-view JEPA', '0.018', '64.4%'],
          ['Qwen3-8B rerun', '0.018', '47.6%'],
        ]}/>
        <p className="note">FOSCTTM is the fraction of candidates ranked ahead of the true match. Both models score the same on average here. Their zero-shot classification accuracy differs.</p>
        <Source href={JEPA + '#page=14'}>Balestriero &amp; LeCun · §5.2 and Table 4</Source>
      </div>
    </div>},
  {hash:'slide-9', topic:'Limits', title:'Where the evidence stops', lead:'Exact alignment is a result about an identifiable spectral optimum. The neural experiments measure partial agreement.',
    body: ({zoom}) => <div className="split limits"><div>
      <Point title="Proof assumptions">The theorem assumes recoverable states and matched marginals. The practical LeJEPA objective uses SIGReg, a Gaussian regularizer whose uniqueness is outside the proof.</Point>
      <Point title="Data and tuning">Two Recap descriptions per image come from a vision-language teacher. Including the higher-SIGReg run changes mean WIT alignment from <strong>0.184 to 0.168</strong>.</Point>
      <Point title="What the scaling law predicts">Fit Flickr R@1 as a function of good-view fraction, training draws, and unique images. Across 85 new runs, RMSE is 0.0093 versus 0.0096 between seeds. Some much longer runs fall below forecast.</Point>
      <Source href={JEPA + '#page=15'}>Discussion and limitations</Source>
    </div><Figure id="law" zoom={zoom}/></div>},
  {hash:'slide-10', topic:'FER comparison', title:'Shared geometry and internal computation', lead:'The JEPA paper asks whether encoders agree on which examples are similar. The FER paper asks whether a model reuses computations and keeps independent factors separately controllable.',
    body: ({zoom}) => <><div className="split fer"><Figure id="sweeps" zoom={zoom}/><div>
      <Point title="What FER means">Fracture is duplicated logic across contexts, such as constructing each side of a symmetric skull separately. Entanglement is coupled behavior, such as moving the jaw and unintentionally distorting the eye. The ideal is one reusable computation per factor, with independent control.</Point>
      <Point title="What the skull experiment shows">Two networks map pixel coordinates to nearly identical skull images. Their hidden activation maps and responses to weight changes differ. Selected evolved weight sweeps give more coherent edits. The training paths differ in several ways.</Point>
      <Point title="What the JEPA theorem establishes">Under its assumptions, one rotation or reflection maps the embeddings of one encoder to those of the other, preserving all pairwise distances. That leaves the choice of axes open. Reuse and selective control are properties of how the model computes, which the alignment test does not measure.</Point>
    </div></div>
    <div className="math-panel compact"><MathText block>{tex`h=(s_1,s_2)^\top,\qquad h^\prime=\tfrac{1}{\sqrt{2}}(s_1+s_2,\ s_2-s_1)^\top`}</MathText><p>Illustration. A 45° change of axes mixes the two factors in each coordinate and preserves every pairwise distance. Rotating back recovers both factors. This example shows basis dependence.</p></div>
    <Source href={FER}>Kumar, Clune, Lehman &amp; Stanley · Questioning Representational Optimism in Deep Learning: The Fractured Entangled Representation Hypothesis · arXiv:2505.11581v2</Source><br/>
    <Source href={JEPA + '#page=3'}>Balestriero &amp; LeCun · Platonic Representation Theorem, §2.1</Source></>},
];

function indexFromHash() {
  return Math.max(0, slides.findIndex(slide => slide.hash === location.hash.slice(1)));
}

function App() {
  const [index, setIndex] = useState(indexFromHash);
  const [zoom, setZoom] = useState(null);
  const dialog = useRef(null);
  const active = slides[index];
  const [full, setFull] = useState(Boolean(document.fullscreenElement));

  useEffect(() => {
    const sync = () => setFull(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch (error) {
      console.warn('Fullscreen is unavailable in this browser context.', error);
    }
  }

  function go(i) {
    if (i >= 0 && i < slides.length && i !== index) location.hash = slides[i].hash;
  }
  useEffect(() => {
    const sync = () => { setIndex(indexFromHash()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);
  useEffect(() => {
    const key = e => {
      if (zoom || e.altKey || e.metaKey || e.ctrlKey || /^(SELECT|INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
        go(e.key === 'Home' ? 0 : e.key === 'End' ? slides.length - 1 : index + (e.key === 'ArrowRight' ? 1 : -1));
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [index, zoom]);
  useEffect(() => {
    if (zoom && !dialog.current.open) dialog.current.showModal();
  }, [zoom]);
  useEffect(() => { document.title = active.title + ' · Platonic Representations'; }, [active]);

  const Body = active.body;
  return <>
    <main key={index} className={'slide slide-' + (index + 1)} aria-labelledby="slide-title">
      <div className="eyebrow"><span>{String(index + 1).padStart(2, '0')}</span> {active.topic}</div>
      <h1 id="slide-title">{active.title}</h1>
      <p className="lead">{active.lead}</p>
      <Body zoom={setZoom}/>
    </main>
    <nav className="controls" aria-label="Slide navigation">
      <button onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous slide" title="Previous slide"><span aria-hidden="true">←</span></button>
      <label className="slide-count"><span className="sr-only">Jump to slide</span><span aria-hidden="true">{index + 1} / {slides.length} <span className="caret">⌄</span></span>
        <select value={index} onChange={e => go(Number(e.target.value))}>{slides.map((s, i) => <option key={s.title} value={i}>{i + 1}. {s.title}</option>)}</select>
      </label>
      <button onClick={() => go(index + 1)} disabled={index === slides.length - 1} aria-label="Next slide" title="Next slide"><span aria-hidden="true">→</span></button>
      {document.fullscreenEnabled && <button onClick={toggleFullscreen} aria-label={full ? 'Exit fullscreen' : 'Enter fullscreen'} title={full ? 'Exit fullscreen' : 'Enter fullscreen'}>
        <svg aria-hidden="true" width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d={full ? 'M3 7h4V3m6 0v4h4M3 13h4v4m6 0v-4h4' : 'M3 7V3h4m6 0h4v4M3 13v4h4m6 0h4v-4'}/>
        </svg>
      </button>}
    </nav>
    <span className="sr-only" aria-live="polite">Slide {index + 1} of {slides.length}. {active.title}</span>
    <dialog ref={dialog} className="zoom" onClose={() => setZoom(null)} aria-label={zoom ? figures[zoom][2] : 'Paper figure'}>
      {zoom && <><button className="close" onClick={() => dialog.current.close()} aria-label="Close figure">×</button>
        <img src={import.meta.env.BASE_URL + 'figures/' + figures[zoom][0] + '.webp'} alt={figures[zoom][1]}/>
        <Source href={figures[zoom][3]}>{figures[zoom][2]}</Source></>}
    </dialog>
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);
