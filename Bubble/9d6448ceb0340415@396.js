// https://observablehq.com/@eightants/moving-bubble-chart-using-d3-js-internship-search-data-w-per@396
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["2021search.csv",new URL("./files/bed52ca013b9c31f8fadc251dfd61653b595532e28f1455e86d31d5232f05891541f6d43e7fa8362dcdda91f2c094961968fa95136e95961946cc10318db149c",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  main.variable(observer("width")).define("width", function(){return(
860
)});
  main.variable(observer("height")).define("height", function(){return(
300
)});
  main.variable(observer("radius")).define("radius", function(){return(
2
)});
  main.variable(observer("padding")).define("padding", function(){return(
1
)});
  main.variable(observer("cluster_padding")).define("cluster_padding", function(){return(
5
)});
  main.variable(observer("groups")).define("groups", ["width","height"], function(width,height)
{
  const groups = {
    "inactive": { x: width/5, y: 3*height/6, color: "#808080", cnt: 0, 
    fullname: "Not arrived", max: 100000},
    "wait": { x: 2*width/5, y: 3*height/6, color: "#FFA500", cnt: 0, 
    fullname: "Waiting", max: 100000},
    "vac": { x: 3*width/5, y: 3*height/6, color: "#93D1BA", cnt: 0, 
    fullname: "Vaccinating" , max: 80 },
    "obs": { x: 4*width/5, y: 3*height/6, color: "#a579ce", cnt: 0, 
    fullname: "Observation" , max: 200},
    "finish": { x: 5*width/5, y: 3*height/6, color: "#008000", cnt: 0, 
    fullname: "Finished" , max: 100000},
  };
  return groups
}
);
  main.variable(observer("groups2")).define("groups2", ["width","height"], function(width,height)
{
  const groups2 = {
    "inactive": { x: width/5, y: 3*height/6, color: "#808080", cnt: 0, 
    fullname: "Not arrived", max: 100000},
    "wait": { x: 2*width/5, y: 3*height/6, color: "#FFA500", cnt: 0, 
    fullname: "Waiting", max: 100000},
    "vac": { x: 3*width/5, y: 3*height/6, color: "#93D1BA", cnt: 0, 
    fullname: "Vaccinating" , max: 80 },
    "obs": { x: 4*width/5, y: 3*height/6, color: "#a579ce", cnt: 0, 
    fullname: "Observation" , max: 200},
    "finish": { x: 5*width/5, y: 3*height/6, color: "#008000", cnt: 0, 
    fullname: "Finished" , max: 100000},
  };
  return groups2
}
);
  main.variable(observer("stages")).define("data", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("2021search.csv").csv({typed: true})
)});
  main.variable(observer("people")).define("people", ["stages","d3"], function(stages,d3)
{
  const people = {};
  stages.filter(d => d.ind == 1).forEach(d => {
    if (d3.keys(people).includes(d.pid + "")) {
      people[d.pid + ""].push(d);
    } else {
      people[d.pid + ""] = [d];
    }
  });
  return people
}
);
  main.variable(observer("nodes")).define("nodes", ["d3","people","groups","radius"], function(d3,people,groups,radius){return(
d3.keys(people).map(function(d) {
  // Initialize count for each group.
  groups[people[d][0].grp].cnt += 1;
  return {
    id: "node"+d,
    x: groups[people[d][0].grp].x + Math.random(),
    y: groups[people[d][0].grp].y + Math.random(),
    r: radius,
    color: groups[people[d][Math.max(people[d].length -2,1)].grp].color,
    group: people[d][0].grp,
    timeleft: people[d][0].duration,
    entry : people[d][0].entry,
    exit: people[d][0].exit,
    num: people[d][0].num,
    ind: people[d][0].ind,
    istage: 0,
    stages: people[d]
  }
})
)});

  main.variable(observer("people2")).define("people2", ["stages","d3"], function(stages,d3)
{
  const people2 = {};
  stages.filter(d => d.ind == 2).forEach(d => {
    if (d3.keys(people2).includes(d.pid + "")) {
      people2[d.pid + ""].push(d);
    } else {
      people2[d.pid + ""] = [d];
    }
  });
  return people2
}
);
  main.variable(observer("nodes2")).define("nodes2", ["d3","people2","groups2","radius"], function(d3,people2,groups2,radius){return(
d3.keys(people2).map(function(d) {
  // Initialize count for each group.
  groups2[people2[d][0].grp].cnt += 1;
  return {
    id: "node"+d,
    x: groups2[people2[d][0].grp].x + Math.random(),
    y: groups2[people2[d][0].grp].y + Math.random(),
    r: radius,
    color: groups2[people2[d][Math.max(people2[d].length -2,1)].grp].color,
    group: people2[d][0].grp,
    timeleft: people2[d][0].duration,
    entry : people2[d][0].entry,
    exit: people2[d][0].exit,
    num: people2[d][0].num,
    ind: people2[d][0].ind,
    istage: 0,
    stages: people2[d]
  }
})
)});
  main.variable(observer("chart")).define("chart", ["d3","width","height","nodes","groups","forceCluster","forceCollide"], function(d3,width,height,nodes,groups,forceCluster,forceCollide)
{
  // Variables.
  var time_so_far = 0;
  
  // The SVG object.

  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width+40, height+40]);
  
  // ???
  svg.append("g")
    .attr("transform", "translate(" + 20 + "," + 20 + ")");
    
  // ???
  d3.select("#chart").style("width", (width + 20 + 20) + "px");

  // Circle for each node.
  const circle = svg.append("g")
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("fill", d => d.color);
  
  // Group name labels
  svg.selectAll('.grp')
    .data(d3.keys(groups))
    .join("text")
    .attr("class", "grp")
    .attr("text-anchor", "middle")
    .attr("x", d => groups[d].x)
    .attr("y", d => groups[d].y + 100)
    .text(d => groups[d].fullname);

  // Group counts
  svg.selectAll('.grpcnt')
    .data(d3.keys(groups))
    .join("text")
    .attr("class", "grpcnt")
    .attr("text-anchor", "middle")
    .attr("x", d => groups[d].x)
    .attr("y", d => groups[d].y + 80)
    .text(d => d3.format(",.0f")(Math.min(groups[d].cnt*nodes[1].num/1000,groups[d].max)));
  
  // Forces
  const simulation = d3.forceSimulation(nodes)
    .force("x", d => d3.forceX(d.x))
    .force("y", d => d3.forceY(d.y))
    .force("cluster", forceCluster())
    .force("collide", forceCollide())
    .alpha(.09)
    .alphaDecay(0);

  // Adjust position of circles.
  simulation.on("tick", () => {
    circle
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)

      circle.attr("fill", d => { if (groups[d.group].color == "match") { return d.color }return groups[d.group].color});
  });
  
  const textb = svg.append("text").text("").attr("x", 60).attr("y", 100).attr("fill", "black");
  let startdate = new Date(2020, 6, 1,7,55)
  
  // Make time pass. Adjust node stage as necessary.
  function timer() {
     circle
     .filter(function(d,i){ return Math.max(d.entry-8,0) == time_so_far; })
     .transition()
     .duration(125)
     .ease(d3.easeCubicIn)
     .attr("r", 2)
     .attr("stroke-opacity", 1);
    
    nodes.forEach(function (o, i) {
      o.timeleft -= 1;
      if (o.timeleft == 0 && o.istage < o.stages.length - 1) {
        // Decrease count for previous group.
        groups[o.group].cnt -= 1;
        // Update current node to new group.
        o.istage += 1;
        o.group = o.stages[o.istage].grp;
        o.timeleft = o.stages[o.istage].duration;
        // Increment count for new group.
        groups[o.group].cnt += 1;
      }
    });
    // Increment time.
  
    time_so_far += 1;
    var currdate = new Date(startdate.getTime() + time_so_far * 60000);
    textb.text(currdate.toTimeString().slice(0,8));
    // Update counters.
    svg.selectAll('.grpcnt').text(d => d3.format(",.0f")(Math.min(groups[d].cnt*nodes[1].num/1000,groups[d].max)));
    
      circle
     .filter(function(d,i){ return Math.min(d.exit+8,755) == time_so_far; })
     .transition()
     .duration(125)
     .ease(d3.easeCubicIn)
     .attr("r", 0)
     .attr("stroke-opacity", 0)
     .remove();
    
    if (time_so_far>=755) {
      interval.stop();
    }
  } // @end timer()
  
  var interval

  var playButton = svg.append('rect')
  .attr('x', 10)
  .attr('y', 20)
  .attr('width', 50)
  .attr('height', 40)
  .attr('stroke', 'black')
  .attr('fill', '#69a3b2');
  
   playButton.text("Pause");
  
  if (time_so_far === 0) {
  interval = d3.interval(timer, 25);
  }
  
  playButton
  .on("mouseover", mouseover)
  .on("mouseout", mouseout);
            
    playButton
    .on("click", function() {
    var button = d3.select(this);
    if (button.text() == "Pause") {
      interval.stop();
      button.text("Play");
    } else {
      interval = d3.interval(timer, 25);
      button.text("Pause");
    }
  })
  
  return svg.node()
}
);

  main.variable(observer("chart2")).define("chart2", ["d3","width","height","nodes2","groups2","forceCluster","forceCollide"], function(d3,width,height,nodes2,groups2,forceCluster,forceCollide)
{
  // Variables.
  var time_so_far = 0;
  
  // The SVG object.

  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width+40, height+40]);
  
  // ???
  svg.append("g")
    .attr("transform", "translate(" + 20 + "," + 20 + ")");
    
  // ???
  d3.select("#chart").style("width", (width + 20 + 20) + "px");

  // Circle for each node.
  const circle = svg.append("g")
    .selectAll("circle")
    .data(nodes2)
    .join("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("fill", d => d.color);
  
  // Group name labels
  svg.selectAll('.grp2')
    .data(d3.keys(groups2))
    .join("text")
    .attr("class", "grp2")
    .attr("text-anchor", "middle")
    .attr("x", d => groups2[d].x)
    .attr("y", d => groups2[d].y + 100)
    .text(d => groups2[d].fullname);

  // Group counts
  svg.selectAll('.grpcnt2')
    .data(d3.keys(groups2))
    .join("text")
    .attr("class", "grpcnt2")
    .attr("text-anchor", "middle")
    .attr("x", d => groups2[d].x)
    .attr("y", d => groups2[d].y + 80)
    .text(d => d3.format(",.0f")(Math.min(groups2[d].cnt*nodes2[1].num/1000,groups2[d].max)));
  
  // Forces
  const simulation = d3.forceSimulation(nodes2)
    .force("x", d => d3.forceX(d.x))
    .force("y", d => d3.forceY(d.y))
    .force("cluster", forceCluster())
    .force("collide", forceCollide())
    .alpha(.09)
    .alphaDecay(0);

  // Adjust position of circles.
  simulation.on("tick", () => {
    circle
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)

      circle.attr("fill", d => { if (groups2[d.group].color == "match") { return d.color }return groups2[d.group].color});
  });
  
  const textb = svg.append("text").text("").attr("x", 60).attr("y", 100).attr("fill", "black");
  let startdate = new Date(2020, 6, 1,7,55)
  
  // Make time pass. Adjust node stage as necessary.
  function timer2() {
     circle
     .filter(function(d,i){ return Math.max(d.entry-8,0) == time_so_far; })
     .transition()
     .duration(125)
     .ease(d3.easeCubicIn)
     .attr("r", 2)
     .attr("stroke-opacity", 1);
    
    nodes2.forEach(function (o, i) {
      o.timeleft -= 1;
      if (o.timeleft == 0 && o.istage < o.stages.length - 1) {
        // Decrease count for previous group.
        groups2[o.group].cnt -= 1;
        // Update current node to new group.
        o.istage += 1;
        o.group = o.stages[o.istage].grp;
        o.timeleft = o.stages[o.istage].duration;
        // Increment count for new group.
        groups2[o.group].cnt += 1;
      }
    });
    // Increment time.
  
    time_so_far += 1;
    var currdate = new Date(startdate.getTime() + time_so_far * 60000);
    textb.text(currdate.toTimeString().slice(0,8));
    // Update counters.
    svg.selectAll('.grpcnt2').text(d => d3.format(",.0f")(Math.min(groups2[d].cnt*nodes2[1].num/1000,groups2[d].max)));
    
      circle
     .filter(function(d,i){ return Math.min(d.exit+8,755) == time_so_far; })
     .transition()
     .duration(125)
     .ease(d3.easeCubicIn)
     .attr("r", 0)
     .attr("stroke-opacity", 0)
     .remove();
    
    if (time_so_far>=755) {
      interval2.stop();
    }
  } // @end timer()
  
  var interval2

  var playButton = svg.append('rect')
  .attr('x', 10)
  .attr('y', 20)
  .attr('width', 50)
  .attr('height', 40)
  .attr('stroke', 'black')
  .attr('fill', '#69a3b2');
  
  playButton.text("Pause");
  
  if (time_so_far === 0) {
  interval2 = d3.interval(timer2, 25);
  }
  
  playButton
  .on("mouseover", mouseover)
  .on("mouseout", mouseout);
            
    playButton
    .on("click", function() {
    var button = d3.select(this);
    if (button.text() == "Pause") {
      interval2.stop();
      button.text("Play");
    } else {
      interval2 = d3.interval(timer2, 25);
      button.text("Pause");
    }
  })
  
  return svg.node()
}
);

  main.variable(observer("forceCluster")).define("forceCluster", ["groups"], function(groups){return(
function forceCluster() {
  const strength = 2;
  let nodes;

  function force(alpha) {
    const l = alpha * strength;
    for (const d of nodes) {
      d.vx -= (d.x - groups[d.group].x) * l;
      d.vy -= (d.y - groups[d.group].y) * l;
    }
  }
  force.initialize = _ => nodes = _;

  return force;
}
)});

  main.variable(observer("forceCollide")).define("forceCollide", ["padding","cluster_padding","d3"], function(padding,cluster_padding,d3){return(
function forceCollide() {
  const alpha = 0.2; // fixed for greater rigidity!
  const padding1 = padding; // separation between same-color nodes
  const padding2 = cluster_padding; // separation between different-color nodes
  let nodes;
  let maxRadius;

  function force() {
    const quadtree = d3.quadtree(nodes, d => d.x, d => d.y);
    for (const d of nodes) {
      const r = d.r + maxRadius;
      const nx1 = d.x - r, ny1 = d.y - r;
      const nx2 = d.x + r, ny2 = d.y + r;
      
      quadtree.visit((q, x1, y1, x2, y2) => {
        if (!q.length) do {
          if (q.data !== d) {
            const r = d.r + q.data.r + (d.group === q.data.group ? padding1 : padding2);
            let x = d.x - q.data.x, y = d.y - q.data.y, l = Math.hypot(x, y);
            if (l < r) {
              l = (l - r) / l * alpha;
              d.x -= x *= l, d.y -= y *= l;
              q.data.x += x, q.data.y += y;
            }
          }
        } while (q = q.next);
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    }
  }

  force.initialize = _ => maxRadius = d3.max(nodes = _, d => d.r) + Math.max(padding1, padding2);

  return force;
}
)});

  main.variable(observer("mouseover")).define("mouseover", [], function(){return(
function mouseover(){
  d3.select(this).attr("opacity", .5);
  d3.select(this).style("cursor", "pointer");
}
)});

  main.variable(observer("mouseout")).define("mouseout", [], function(){return(
function mouseout(){
  d3.select(this).attr("opacity", 1);
  d3.select(this).style("cursor", "default"); 
}
)});
  return main;
}
